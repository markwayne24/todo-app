import { SendWelcomeEmailType } from '@/common/queues/users/users.types';
import { EmailService } from '@/common/services/email';
import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class UserHandlerService {
  constructor(
    @InjectPinoLogger(UserHandlerService.name)
    private readonly logger: PinoLogger,
    private readonly _emailService: EmailService,
  ) {}

  async handleSendWelcomeEmail(params: SendWelcomeEmailType) {
    try {
      const { email, name } = params;
      // send email to user
      await this._emailService.sendWelcomeEmail({
        to: email,
        name: name,
      });

      this.logger.info(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
