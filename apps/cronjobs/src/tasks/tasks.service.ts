import { Task } from '@/common/entities/tasks/tasks.entity';
import { User } from '@/common/entities/users/users.entity';
import { TaskRepository } from '@/common/repositories/tasks/tasks.repository';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { EmailService } from '@/common/services/email';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ObjectId } from 'mongodb';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  QUEUE_TASKS,
  TASK_JOBS_NAME,
} from '@/common/queues/tasks/tasks.constants';
import {
  SendTaskReminderType,
  SendTaskOverdueType,
  UpdateOverdueStatusType,
} from '@/common/queues/tasks/tasks.types';

interface TaskWithUser {
  userId: string;
  name: string;
  email: string;
  tasks: {
    _id: string;
    taskTitle: string;
    dueDate: Date;
    status: string;
  }[];
}

interface DateRange {
  start: Date;
  end: Date;
}

@Injectable()
export class TaskService {
  constructor(
    @InjectPinoLogger(TaskService.name)
    private readonly logger: PinoLogger,
    private readonly userRepository: UserRepository,
    private readonly taskRepository: TaskRepository,
    private readonly emailService: EmailService,
    @InjectQueue(QUEUE_TASKS.name)
    private readonly _taskQueue: Queue,
  ) {}

  // Run every day at 12:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async reminderTasks() {
    try {
      this.logger.info('Starting daily task reminders');

      const dateRange = this.getTomorrowDateRange();
      const tasks = await this.getTasksWithUsers(dateRange, [
        'pending',
        'in-progress',
      ]);

      this.logger.info(`Found ${tasks.length} users with tasks due tomorrow`);

      await this.queueTaskReminders(tasks, 'reminder');
    } catch (error) {
      this.logger.error('Error queuing task reminders', { error });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async overdueTasks() {
    try {
      this.logger.info('Checking for overdue tasks');

      const dateRange = this.getOverdueDateRange();
      const tasks = await this.getTasksWithUsers(dateRange, [
        'pending',
        'in-progress',
      ]);

      this.logger.info(`Found ${tasks.length} users with overdue tasks`);

      await this.queueTaskReminders(tasks, 'overdue');
      await this.queueUpdateOverdueStatuses(tasks);
    } catch (error) {
      this.logger.error('Error queuing overdue tasks', { error });
    }
  }

  private async getTasksWithUsers(
    dateRange: DateRange,
    statuses: string[],
  ): Promise<TaskWithUser[]> {
    const pipeline = [
      {
        $match: {
          dueDate: {
            $gte: dateRange.start,
            $lte: dateRange.end,
          },
          status: { $in: statuses },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $group: {
          _id: '$user._id',
          name: { $first: '$user.name' },
          email: { $first: '$user.email' },
          tasks: {
            $push: {
              _id: '$_id',
              taskTitle: '$title',
              dueDate: '$dueDate',
              status: '$status',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: 1,
          email: 1,
          tasks: 1,
        },
      },
    ];

    return (await this.taskRepository.aggregate(pipeline)) as TaskWithUser[];
  }

  private async queueTaskReminders(
    tasks: TaskWithUser[],
    type: 'reminder' | 'overdue',
  ) {
    const queuePromises = tasks.map(async (task) => {
      try {
        const jobData: SendTaskReminderType | SendTaskOverdueType = {
          userId: task.userId,
          name: task.name,
          email: task.email,
          tasks: task.tasks,
        };

        const jobName =
          type === 'reminder'
            ? TASK_JOBS_NAME.SEND_TASK_REMINDER
            : TASK_JOBS_NAME.SEND_TASK_OVERDUE;

        await this._taskQueue.add(jobName, jobData);

        this.logger.info(
          `Queued ${type} email job for ${task.email} with ${task.tasks.length} tasks`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to queue ${type} email job for ${task.email}`,
          {
            error,
          },
        );
      }
    });

    await Promise.allSettled(queuePromises);
  }

  private async queueUpdateOverdueStatuses(tasks: TaskWithUser[]) {
    try {
      // Collect all tasks from all users
      const allTasks = tasks.flatMap((userTask) => userTask.tasks);

      if (allTasks.length === 0) {
        this.logger.info('No tasks to update to overdue status');
        return;
      }

      const jobData: UpdateOverdueStatusType = {
        tasks: allTasks,
      };

      await this._taskQueue.add(TASK_JOBS_NAME.UPDATE_OVERDUE_STATUS, jobData);

      this.logger.info(
        `Queued update overdue status job for ${allTasks.length} tasks`,
      );
    } catch (error) {
      this.logger.error('Failed to queue update overdue status job', {
        error,
      });
    }
  }

  private getTomorrowDateRange(): DateRange {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfTomorrow = new Date(tomorrow);
    startOfTomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    return { start: startOfTomorrow, end: endOfTomorrow };
  }

  private getOverdueDateRange(): DateRange {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    return { start: new Date(0), end: startOfDay }; // From epoch to start of today
  }

  private getStartAndEndOfToday(): DateRange {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    return { start: startOfDay, end: endOfDay };
  }
}
