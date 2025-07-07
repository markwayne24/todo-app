import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_CONFIG } from '@/common/config/auth';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { MongoModule } from '@/databases/mongo/mongo.module';
import { UserService } from '../users/users.service';
import { EmailModule } from '@/common/services/email';

@Module({
  imports: [
    ConfigModule,
    MongoModule,
    JwtModule.register({
      global: true,
      secret: AUTH_CONFIG.JWT_SECRET_KEY,
      signOptions: { expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN },
    }),

    UserModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, UserService],
})
export class AuthModule {}
