import {
  SendTaskReminderType,
  SendTaskOverdueType,
  UpdateOverdueStatusType,
} from '@/common/queues/tasks/tasks.types';
import { TaskRepository } from '@/common/repositories/tasks/tasks.repository';
import { EmailService } from '@/common/services/email';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class TaskHandlerService {
  constructor(
    @InjectPinoLogger(TaskHandlerService.name)
    private readonly _logger: PinoLogger,
    private readonly _emailService: EmailService,
    private readonly _taskRepository: TaskRepository,
  ) {}

  async handleSendTaskReminder(params: SendTaskReminderType): Promise<string> {
    try {
      const { email, name, tasks } = params;

      const emailData = {
        to: email,
        name: name,
        tasks: tasks.map((item) => ({
          taskTitle: item.taskTitle,
          dueDate: item.dueDate,
        })),
      };

      await this._emailService.sendTaskReminder(emailData);

      this._logger.info(
        `Sent task reminder email to ${email} for ${tasks.length} tasks`,
      );

      return `Successfully sent task reminder email to ${email}`;
    } catch (error) {
      this._logger.error(
        `Failed to send task reminder email to ${params.email}`,
        {
          error,
        },
      );
      throw error;
    }
  }

  async handleSendTaskOverdue(params: SendTaskOverdueType): Promise<string> {
    try {
      const { email, name, tasks } = params;

      const emailData = {
        to: email,
        name: name,
        tasks: tasks.map((item) => ({
          taskTitle: item.taskTitle,
          dueDate: item.dueDate,
        })),
      };

      await this._emailService.sendTaskOverdueEmail(emailData);

      this._logger.info(
        `Sent task overdue email to ${email} for ${tasks.length} tasks`,
      );

      return `Successfully sent task overdue email to ${email}`;
    } catch (error) {
      this._logger.error(
        `Failed to send task overdue email to ${params.email}`,
        {
          error,
        },
      );
      throw error;
    }
  }

  async handleUpdateOverdueStatus(
    params: UpdateOverdueStatusType,
  ): Promise<string> {
    try {
      const { tasks } = params;

      const updatePromises = tasks.map(async (task) => {
        try {
          await this._taskRepository.updateOne(
            { _id: new ObjectId(task._id) },
            { status: 'overdue' },
          );
          this._logger.info(`Updated task ${task._id} to overdue status`);
        } catch (error) {
          this._logger.error(`Failed to update task ${task._id} status`, {
            error,
          });
          throw error;
        }
      });

      await Promise.allSettled(updatePromises);

      this._logger.info(`Updated ${tasks.length} tasks to overdue status`);

      return `Successfully updated ${tasks.length} tasks to overdue status`;
    } catch (error) {
      this._logger.error('Failed to update overdue task statuses', {
        error,
      });
      throw error;
    }
  }
}
