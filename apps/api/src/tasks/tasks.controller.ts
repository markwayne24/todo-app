import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { GetTasksDto } from './dtos/get-tasks.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  QUEUE_TASKS,
  TASK_JOBS_NAME,
} from '@/common/queues/tasks/tasks.constants';
import { SendTaskStatusUpdateEmailType } from '@/common/queues/tasks/tasks.types';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tasks')
@UsePipes(new ValidationPipe({ transform: true }))
export class TaskController {
  constructor(
    @InjectQueue(QUEUE_TASKS.name)
    private readonly _taskQueue: Queue,
    private readonly taskService: TaskService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Create a new task for the authenticated user',
  })
  @ApiBody({
    type: CreateTaskDto,
    description: 'Task creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        title: { type: 'string', example: 'Complete project documentation' },
        description: {
          type: 'string',
          example: 'Write comprehensive documentation for the todo app',
        },
        dueDate: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        priority: {
          type: 'string',
          example: 'high',
          enum: ['low', 'medium', 'high'],
        },
        category: { type: 'string', example: 'work' },
        status: {
          type: 'string',
          example: 'pending',
          enum: ['pending', 'completed', 'cancelled', 'in-progress', 'overdue'],
        },
        userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    const userId = req?.user?.sub;
    return this.taskService.create(userId, createTaskDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get user tasks',
    description:
      'Retrieve tasks for the authenticated user with optional filtering and pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of items per page (1-100)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    example: 'pending',
    description: 'Filter by task status',
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    type: String,
    example: 'medium',
    description: 'Filter by priority',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    example: 'work',
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    example: 'documentation',
    description: 'Search by title',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    example: 'createdAt',
    description: 'Sort by field',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              title: {
                type: 'string',
                example: 'Complete project documentation',
              },
              description: {
                type: 'string',
                example: 'Write comprehensive documentation',
              },
              dueDate: {
                type: 'string',
                example: '2024-01-15T10:00:00.000Z',
              },
              priority: { type: 'string', example: 'high' },
              category: { type: 'string', example: 'work' },
              status: { type: 'string', example: 'pending' },
              userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
              createdAt: {
                type: 'string',
                example: '2024-01-15T10:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                example: '2024-01-15T10:00:00.000Z',
              },
            },
          },
        },
        total: { type: 'number', example: 25 },
        limit: { type: 'number', example: 10 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTasks(@Query() query: GetTasksDto, @Req() req: any) {
    const userId = req?.user?.sub;
    return this.taskService.getTasks(userId, query);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a task',
    description: 'Update an existing task by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateTaskDto,
    description: 'Task update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        title: { type: 'string', example: 'Updated project documentation' },
        description: {
          type: 'string',
          example: 'Updated comprehensive documentation',
        },
        dueDate: { type: 'string', example: '2024-01-16T10:00:00.000Z' },
        priority: { type: 'string', example: 'high' },
        category: { type: 'string', example: 'personal' },
        status: { type: 'string', example: 'in-progress' },
        userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-16T10:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.sub;
    return this.taskService.update(userId, id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a task',
    description: 'Delete a task by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Task deleted successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req?.user?.sub;
    return this.taskService.remove(userId, id);
  }

  @Post(':id/status')
  @ApiOperation({
    summary: 'Update task status',
    description: 'Update the status of a specific task',
  })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: UpdateTaskStatusDto,
    description: 'Task status update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Task status updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        title: { type: 'string', example: 'Complete project documentation' },
        status: { type: 'string', example: 'completed' },
        updatedAt: { type: 'string', example: '2024-01-16T10:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid status value' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.sub;
    const taskDetails = await this.taskService.updateStatus(
      userId,
      id,
      updateTaskStatusDto,
    );

    if (taskDetails) {
      const payload: SendTaskStatusUpdateEmailType = taskDetails.data;

      await this._taskQueue.add(
        TASK_JOBS_NAME.SEND_TASK_STATUS_UPDATE_EMAIL,
        payload,
      );
    }

    return taskDetails;
  }
}
