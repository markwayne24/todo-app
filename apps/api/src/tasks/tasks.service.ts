import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from '@/repositories/tasks/tasks.repository';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task } from '@/common/entities/tasks/tasks.entity';
import { Filter, FindOptions, ObjectId } from 'mongodb';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { GetTasksDto } from './dtos/get-tasks.dto';
import { UserRepository } from '@/common/repositories/users/users.repository';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import { EmailService } from '@/common/services/email';

@Injectable()
export class TaskService {
  constructor(
    @InjectPinoLogger(TaskService.name)
    private readonly logger: PinoLogger,
    private readonly _taskRepository: TaskRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  async getTasks(userId: string, params: GetTasksDto) {
    try {
      const { sort = 'desc', limit, skip, ...filters } = params;

      const query = this._buildQuery(filters);
      const options = this._buildOptions(sort, limit, skip);

      const [tasks, total] = await Promise.all([
        this._taskRepository.find(
          { ...query, userId: new ObjectId(userId) },
          options,
        ),
        this._taskRepository.count({ ...query, userId: new ObjectId(userId) }),
      ]);

      console.log(tasks, 'tasks');

      return { data: tasks, total };
    } catch (error: unknown) {
      this.logger.error('Failed to fetch tasks', { error, params });
      throw new Error(
        `Failed to fetch tasks: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private _buildQuery(filters: Partial<GetTasksDto>): Filter<Task> {
    const query: Filter<Task> = {};
    const { status, priority, search, category } = filters;

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = search;
    if (category) query.category = category;

    return query;
  }

  private _buildOptions(
    sort: string,
    limit?: number,
    skip?: number,
  ): FindOptions<Task> {
    return {
      sort: { createdAt: sort === 'asc' ? 1 : -1 },
      ...(limit && { limit }),
      ...(skip && { skip }),
    };
  }

  async create(userId: string, createTaskDto: CreateTaskDto) {
    try {
      this.logger.info(`Creating task for user: ${userId}`);
      const user = await this._userRepository.findOne({
        _id: new ObjectId(userId),
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const taskData: Task = {
        ...createTaskDto,
        userId: new ObjectId(userId),
        dueDate: new Date(createTaskDto.dueDate),
        status: 'pending',
        priority: createTaskDto.priority || 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await this._taskRepository.create(taskData);
      return { ...taskData, _id: result.insertedId };
    } catch (error) {
      throw error;
    }
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    try {
      const task = await this._taskRepository.findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(userId),
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      await this._taskRepository.deleteOne({
        _id: new ObjectId(id),
        userId: new ObjectId(userId),
      });

      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async update(userId: string, id: string, params: UpdateTaskDto) {
    try {
      // check user is owner of the task
      const user = await this._userRepository.findOne({
        _id: new ObjectId(userId),
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const task = await this._taskRepository.findOne({
        _id: new ObjectId(id),
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      const data: Partial<Task> = {
        ...params,
        dueDate: new Date(params?.dueDate),
        updatedAt: new Date(),
      };

      await this._taskRepository.updateOne({ _id: new ObjectId(id) }, data);

      return {
        message: 'Task updated successfully',
        data: {
          _id: task._id.toString(),
          userId: task.userId.toString(),
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(userId: string, id: string, params: UpdateTaskStatusDto) {
    try {
      const user = await this._userRepository.findOne({
        _id: new ObjectId(userId),
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const task = await this._taskRepository.findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(userId),
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }

      const data: Partial<Task> = {
        ...params,
        updatedAt: new Date(),
      };

      await this._taskRepository.updateOne({ _id: new ObjectId(id) }, data);

      return {
        message: 'Task status updated successfully',
        data: {
          id: task._id.toString(),
          email: user.email,
          name: user.name,
          taskTitle: task.title,
          status: params.status,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
