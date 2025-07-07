import { SendLoginAttemptEmailType } from '@/common/queues/auth/auth.types';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { EmailService } from '@/common/services/email';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthHandlerService {
  constructor(
    @InjectPinoLogger(AuthHandlerService.name)
    private readonly _logger: PinoLogger,
    private readonly _emailService: EmailService,
    private readonly _userRepository: UserRepository,
  ) {}
  async handleSendingLoginAttemptEmail(
    params: SendLoginAttemptEmailType,
  ): Promise<string> {
    try {
      const { id } = params;
      const user = await this._userRepository.findOne({
        _id: new ObjectId(id),
      });

      if (!user) {
        return null;
      }
      await this._emailService.sendLoginAttemptEmail({
        to: user.email,
        time: new Date().toISOString(),
      });

      return `Successfully sent email to ${user.email}`;
    } catch (error) {
      this._logger.error(error);
    }
  }
}
