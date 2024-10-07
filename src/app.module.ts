import { Module } from '@nestjs/common';
import { RegularModule } from './regular/regular.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'development' ? '.env' : undefined,
      isGlobal: true, // 전체 모듈에서 사용할 수 있도록 설정
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWD,
      database: 'testdb',
      synchronize: true, // 저장된 데이터가 사라질 수 있으니 개발 중에만 사용
      autoLoadEntities: true,
      // logging: true,
      // logger: 'advanced-console',
    }),
    RegularModule,
  ],
})
export class AppModule {}
