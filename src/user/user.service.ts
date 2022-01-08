import { Injectable, ParseUUIDPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, ILike, Like, Equal, In, getRepository } from 'typeorm';
import {
  PaginateDTO,
  FilterOptions,
} from '../@helpers/pagination/paginate.dto';
import { Paginate } from '../@helpers/pagination/paginate';
import { Validation } from '../@helpers/validations/db-data-validations';
import { Encrypt } from '../@helpers/data-modification/data-modification';
import { Test } from 'src/test/entities/test.entity';
import { Messages } from '../@helpers/validations/messages';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.validateFields(createUserDto);
    const userCreation = this.userRepo.create(createUserDto);
    userCreation.test = await getRepository(Test).save(
      getRepository(Test).create(),
    );
    return this.userRepo.save(userCreation);
  }

  async findAll(pagination: PaginateDTO) {
    // console.log(pagination.take);
    // let where = {};
    // const whereArray = [];

    // if (pagination.filter) {
    //   pagination.filter.forEach((data) => {
    //     let operation;
    //     if (data.operation === 'equals') {
    //       operation = Like(data.value);
    //     } else if (data.operation === 'equalsignorecase') {
    //       operation = ILike(data.value);
    //     } else if (data.operation === 'contains') {
    //       operation = Like(`%${data.value.toString()}%`);
    //     } else {
    //       operation = data.value;
    //     }
    //     where[data.fieldName] = operation;
    //   });
    //   whereArray.push(where);
    // }

    // if (pagination.filterAnd) {
    //   where = {};
    //   pagination.filterAnd.forEach((data) => {
    //     let operation;
    //     if (data.operation === 'equals') {
    //       operation = Like(data.value.toString());
    //     } else if (data.operation === 'equalsignorecase') {
    //       operation = ILike(data.value.toString());
    //     } else if (data.operation === 'contains') {
    //       operation = Like(`%${data.value.toString()}%`);
    //     } else {
    //       console.log('AQUI');
    //       operation = data.value;
    //     }
    //     where[data.fieldName] = operation;
    //   });
    //   whereArray.push(where);
    // }
    // console.log(where);
    // const [valueToRetrun, total] =( await this.userRepo.findAndCount({
    //   skip: pagination.skip ? pagination.skip : 0,
    //   take: pagination.take ? pagination.take : 10000,
    //   where: where,
    // }));

    return Paginate.paginate<User>(User, pagination);
  }

  async findOne(id: string) {
    return await this.findAll({
      skip: 0,
      take: 1,
      filter: [
        {
          fieldName: 'id',
          operation: 'equalsForID' as FilterOptions,
          value: [id],
        },
      ],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    updateUserDto.id = id;
    await this.validateFields(updateUserDto);
    if (updateUserDto.password) {
      let password = (await this.findOne(updateUserDto.id)).items[0].password;
      updateUserDto.password = await Encrypt.compareAndEncrypt(
        updateUserDto.password,
        password,
      );
    }
    return this.userRepo.save(updateUserDto);
  }

  async remove(id: string) {
    return this.userRepo.softRemove(await this.userRepo.findOne(id));
  }

  async removeMany(ids: string[]) {
    return this.userRepo.softRemove(await this.userRepo.findByIds(ids));
  }

  private async validateFields(userData: CreateUserDto | UpdateUserDto) {
    if (userData.userName) {
      const user = await Validation.elementInDB(
        'userName',
        userData.userName,
        User,
      );
      const userMail = await Validation.elementInDB(
        'email',
        userData.email,
        User,
      );
      if ('id' in userData) {
        if (userData.id === null || userData.id === undefined) {
          throw Error(Messages.fieldCantBeNull("id"));
        }
        if (
          Validation.elementID(userData.id, [
            user && user.id ? user.id : '',
            userMail && userMail.id ? userMail.id : '',
          ])
        ) {
          throw Error(Messages.fieldsExist(['username', 'email']));
        }
      } else {
        if (user || userMail) {
          throw Error(Messages.fieldsExist(['username', 'email']));
        }
      }
    }
  }
}
