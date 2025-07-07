import { Body, Controller, Post, Get, UseGuards, Query } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dtos/create-task.dto';
import { GetUsersDto } from './dtos/get-users.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { SendWelcomeEmailType } from '@/common/queues/users/users.types';
import {
  QUEUE_USERS,
  USERS_JOBS_NAME,
} from '@/common/queues/users/users.constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger,
    @InjectQueue(QUEUE_USERS.name)
    private readonly _userQueue: Queue,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create new user account',
    description: 'Register a new user with email, name, and password',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration data',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Successfully created user',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const userDetails = await this.userService.create(createUserDto);

    if (userDetails) {
      this.logger.info(
        `Queueing welcome email to user ${userDetails.data.email}`,
      );
      const payload: SendWelcomeEmailType = userDetails.data;
      await this._userQueue.add(USERS_JOBS_NAME.SEND_WELCOME_EMAIL, payload);
    }

    return userDetails;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description:
      'Retrieve a paginated list of all registered users, to check if there are registered user. I just expose the endpoint to check if the user is registered',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Users retrieved successfully',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
              },
              email: {
                type: 'string',
                example: 'john.doe@example.com',
              },
              name: {
                type: 'string',
                example: 'John Doe',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
        total: {
          type: 'number',
          example: 5,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid pagination parameters' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(@Query() query: GetUsersDto) {
    this.logger.info(
      `GET /users - Fetching users with pagination: skip=${query.skip}, limit=${query.limit}`,
    );
    return await this.userService.findAll(query.skip, query.limit);
  }
}
