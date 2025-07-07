import { Task } from '@/common/entities/tasks/tasks.entity';
import { User } from '@/common/entities/users/users.entity';
import { TaskRepository } from '@/common/repositories/tasks/tasks.repository';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { EmailService } from '@/common/services/email';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ObjectId } from 'mongodb';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

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

      await this.sendTaskReminders(tasks, 'reminder');
    } catch (error) {
      this.logger.error('Error sending task reminders', { error });
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

      await this.sendTaskReminders(tasks, 'overdue');
      await this.updateOverdueTaskStatuses(tasks);
    } catch (error) {
      this.logger.error('Error processing overdue tasks', { error });
    }
  }

  private async getTasksWithUsers(
    dateRange: DateRange,
    statuses: string[],
  ): Promise<TaskWithUser[]> {
    const pipeline = [
      {
        $match: {
          scheduledTime: {
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
              dueDate: '$scheduledTime',
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

  private async sendTaskReminders(
    tasks: TaskWithUser[],
    type: 'reminder' | 'overdue',
  ) {
    const emailPromises = tasks.map(async (task) => {
      try {
        const emailData = {
          to: task.email,
          name: task.name,
          tasks: task.tasks.map((item) => ({
            taskTitle: item.taskTitle,
            dueDate: item.dueDate,
          })),
        };

        if (type === 'reminder') {
          await this.emailService.sendTaskReminder(emailData);
        } else {
          await this.emailService.sendTaskOverdueEmail(emailData);
        }

        this.logger.info(
          `Sent ${type} email to ${task.email} for ${task.tasks.length} tasks`,
        );
      } catch (error) {
        this.logger.error(`Failed to send ${type} email to ${task.email}`, {
          error,
        });
      }
    });

    await Promise.allSettled(emailPromises);
  }

  private async updateOverdueTaskStatuses(tasks: TaskWithUser[]) {
    const updatePromises = tasks.flatMap((userTask) =>
      userTask.tasks.map(async (task) => {
        try {
          await this.taskRepository.updateOne(
            { _id: new ObjectId(task._id) },
            { status: 'overdue' },
          );
          this.logger.info(`Updated task ${task._id} to overdue status`);
        } catch (error) {
          this.logger.error(`Failed to update task ${task._id} status`, {
            error,
          });
        }
      }),
    );

    await Promise.allSettled(updatePromises);
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
