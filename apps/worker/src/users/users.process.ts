import { Processor, WorkerHost, OnQueueEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UserHandlerService } from './users.handler';
import {
  USERS_JOBS_NAME,
  QUEUE_USERS,
} from '@/common/queues/users/users.constants';
import { SendWelcomeEmailType } from '@/common/queues/users/users.types';

@Processor(QUEUE_USERS)
export class UserProcessConsumer extends WorkerHost {
  constructor(
    @InjectPinoLogger(UserProcessConsumer.name)
    private readonly _logger: PinoLogger,
    private readonly _userHandlerService: UserHandlerService,
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    this._logger.info(`Received from process: ${JSON.stringify(job.data)}`);

    try {
      if (job.name === USERS_JOBS_NAME.SEND_WELCOME_EMAIL) {
        const payload: SendWelcomeEmailType = job.data;
        this._logger.info(
          `Processing job with payload: ${JSON.stringify(payload)}`,
        );
        this._logger.info(`Received ${USERS_JOBS_NAME.SEND_WELCOME_EMAIL}`);
        await this._userHandlerService.handleSendWelcomeEmail(payload);
      }
    } catch (error) {
      console.error('Error processing job:', error);
      throw error;
    }
  }

  @OnQueueEvent('active')
  onActive(job: Job) {
    this._logger.info(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}...`,
    );
  }

  @OnQueueEvent('completed')
  onCompleted(job: Job) {
    this._logger.info(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueEvent('failed')
  onFailed(job: Job, error: Error) {
    this._logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
    );
  }
}
