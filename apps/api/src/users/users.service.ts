import { User } from '@/common/entities/users/users.entity';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateUserDto } from './dtos/create-task.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger,
    private readonly _userRepository: UserRepository,
  ) {}

  async create(params: CreateUserDto) {
    try {
      const { email, name, password } = params;
      this.logger.info(`Creating user ${email}, name: ${name}`);
      const hashed = await this.hashPasswordBycrypt(password);
      await this._userRepository.create({
        email,
        password: hashed,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return {
        message: 'Successfully created user',
      };
    } catch (error) {
      this.logger.error('Failed to create user', { error });
      throw new Error(error);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this._userRepository.findOne({ email });
      return user;
    } catch (error) {
      this.logger.error('Failed to find user by email', { error });
      throw new Error(error);
    }
  }

  async hashPasswordBycrypt(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  async comparePasswordBycrypt(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
