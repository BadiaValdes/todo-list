import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';

// Connection
import {confg} from '../ormconfig'

// My modules
import { UserModule } from './user/user.module';
import { ListModule } from './list/list.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [TypeOrmModule.forRoot(confg), UserModule, ListModule, ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
