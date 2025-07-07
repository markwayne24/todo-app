import { User } from '@/common/entities/users/users.entity';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { ConflictException, Injectable } from '@nestjs/common';
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

      // check if user already exists
      const user = await this._userRepository.findOne({ email });

      if (user) {
        throw new ConflictException('User already exists');
      }

      this.logger.info(`Creating user ${email}, name: ${name}`);
      const hashed = await this.hashPasswordBycrypt(password);

      console.log(hashed, 'hashedPassword');

      const createdUser = await this._userRepository.create({
        email,
        password: hashed,
        name,
      });

      this.logger.info(`User created ${createdUser.insertedId}`);

      return {
        message: 'Successfully created user',
        data: {
          email,
          name,
        },
      };
    } catch (error) {
      this.logger.error('Failed to create user', { error });
      throw error;
    }
  }

  async hashPasswordBycrypt(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hashSync(password, salt);
  }
  async comparePasswordBycrypt(password: string, hash: string) {
    return await bcrypt.compareSync(password, hash);
  }

  async findAll(skip: number = 0, limit: number = 10) {
    try {
      this.logger.info(
        `Fetching users with pagination: skip=${skip}, limit=${limit}`,
      );

      // Get total count for pagination info
      const totalUsers = await this._userRepository.count({});

      // Get paginated users
      const users = await this._userRepository.find({}, { skip, limit });

      // Remove sensitive information (password) from the response
      const sanitizedUsers = users.map((user) => ({
        _id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      this.logger.info(
        `Found ${sanitizedUsers.length} users (${skip}-${skip + sanitizedUsers.length} of ${totalUsers})`,
      );

      return {
        message: 'Users retrieved successfully',
        data: sanitizedUsers,
        total: totalUsers,
      };
    } catch (error) {
      this.logger.error('Failed to fetch users', { error });
      throw error;
    }
  }
}
