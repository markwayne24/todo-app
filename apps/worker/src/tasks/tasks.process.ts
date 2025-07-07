import {
  TASK_JOBS_NAME,
  QUEUE_TASKS,
} from '@/common/queues/tasks/tasks.constants';
import {
  SendTaskReminderType,
  SendTaskOverdueType,
  UpdateOverdueStatusType,
} from '@/common/queues/tasks/tasks.types';
import { Processor, WorkerHost, OnQueueEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { TaskHandlerService } from './tasks.handler';

@Processor(QUEUE_TASKS)
export class TaskProcessConsumer extends WorkerHost {
  constructor(
    @InjectPinoLogger(TaskProcessConsumer.name)
    private readonly _logger: PinoLogger,
    private readonly _taskHandlerService: TaskHandlerService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this._logger.info(`Received from process: ${JSON.stringify(job.data)}`);

    try {
      switch (job.name) {
        case TASK_JOBS_NAME.SEND_TASK_REMINDER:
          const reminderPayload: SendTaskReminderType = job.data;
          this._logger.info(
            `Processing task reminder job with payload: ${JSON.stringify(reminderPayload)}`,
          );
          return await this._taskHandlerService.handleSendTaskReminder(
            reminderPayload,
          );

        case TASK_JOBS_NAME.SEND_TASK_OVERDUE:
          const overduePayload: SendTaskOverdueType = job.data;
          this._logger.info(
            `Processing task overdue job with payload: ${JSON.stringify(overduePayload)}`,
          );
          return await this._taskHandlerService.handleSendTaskOverdue(
            overduePayload,
          );

        case TASK_JOBS_NAME.UPDATE_OVERDUE_STATUS:
          const updatePayload: UpdateOverdueStatusType = job.data;
          this._logger.info(
            `Processing update overdue status job with payload: ${JSON.stringify(updatePayload)}`,
          );
          return await this._taskHandlerService.handleUpdateOverdueStatus(
            updatePayload,
          );

        default:
          this._logger.warn(`Unknown job type: ${job.name}`);
          throw new Error(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      this._logger.error('Error processing job:', error);
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
