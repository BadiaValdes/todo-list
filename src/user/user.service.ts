import { Injectable, ParseUUIDPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, ILike, Like, Equal, In } from 'typeorm';
import { PaginateDTO, FilterOptions } from '../pagination/paginate.dto';
import { Paginate } from '../pagination/paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.validateFields(createUserDto);
    const userCreation = this.userRepo.create(createUserDto);
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async validateFields(userData: CreateUserDto | UpdateUserDto) {
    if (userData.userName) {
      const user = this.userRepo.findOne({
        where: [
          {
            userName: ILike(userData.userName),
          },
        ],
      });
      const userMail = this.userRepo.findOne({
        where: [
          {
            email: ILike(userData.email),
          },
        ],
      });

      if ('id' in userData) {
        if (userData.id === null || userData.id === undefined) {
          throw Error('The ID cant be null');
        }
        if (
          (await user).id !== userData.id ||
          (await userMail).id !== userData.id
        ) {
          throw Error('The username or email already exist');
        }
      } else {
        console.log(await user);
        if ((await user) || (await userMail)) {
          throw Error('The username or email already exist');
        }
      }
    }
  }
}
