import { UserRepository } from '@/common/repositories/users/users.repository';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UserService } from '../users/users.service';

import { LoginDto } from './dtos/login.dto';
import { ObjectId } from 'mongodb';
import { AUTH_CONFIG } from '@/common/config/auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
    private readonly _userRepository: UserRepository,
    private readonly _userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    try {
      const user = await this._userRepository.findOne({ email });

      if (!user) {
        return null;
      }

      const isPasswordValid = await this._userService.comparePasswordBycrypt(
        pass,
        user.password,
      );

      if (user && isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      this.logger.error('Failed to validate user', { error });
      return null;
    }
  }

  async login(params: LoginDto) {
    try {
      this.logger.info(`Login attempt: ${params.email}`);
      const { email, password } = params;
      const user = await this.validateUser(email, password);

      this.logger.info(`User: ${JSON.stringify(user)}`);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = {
        email: user.email,
        name: user.name,
        sub: user._id.toString(),
      };

      const accessToken = await this.jwtService.signAsync(payload);

      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: AUTH_CONFIG.JWT_REFRESH_EXPIRES_IN,
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error('Failed to login', { error });
      throw error;
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this._userRepository.findOne({
        _id: new ObjectId(payload.sub as string),
      });

      if (!user) throw new ForbiddenException();

      const newAccessToken = this.jwtService.sign({
        sub: user._id.toString(),
        email: user.email,
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      this.logger.error('Failed to refresh', { error });
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
