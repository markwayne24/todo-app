import {
  AUTH_JOBS_NAME,
  QUEUE_AUTH,
} from '@/common/queues/auth/auth.constants';
import { SendLoginAttemptEmailType } from '@/common/queues/auth/auth.types';
import { Processor, WorkerHost, OnQueueEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AuthHandlerService } from './auth.handler';

@Processor(QUEUE_AUTH)
export class AuthProcessConsumer extends WorkerHost {
  constructor(
    @InjectPinoLogger(AuthProcessConsumer.name)
    private readonly _logger: PinoLogger,
    private readonly _authHandlerService: AuthHandlerService,
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    this._logger.info(`Received from process: ${JSON.stringify(job.data)}`);

    try {
      if (job.name === AUTH_JOBS_NAME.SEND_LOGIN_ATTEMPT_EMAIL) {
        const payload: SendLoginAttemptEmailType = job.data;
        this._logger.info(
          `Processing job with payload: ${JSON.stringify(payload)}`,
        );
        this._logger.info(
          `Received ${AUTH_JOBS_NAME.SEND_LOGIN_ATTEMPT_EMAIL}`,
        );
        await this._authHandlerService.handleSendingLoginAttemptEmail(payload);
      }
    } catch (error) {
      console.error('Error processing job:', error);
      throw error; // Ensure the job fails if there is an error
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
