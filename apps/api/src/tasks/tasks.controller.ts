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

@UseGuards(AuthGuard)
@Controller('tasks')
@UsePipes(new ValidationPipe({ transform: true }))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    const userId = req?.user?.sub;
    return this.taskService.create(userId, createTaskDto);
  }

  @Get()
  async getTasks(@Query() query: GetTasksDto, @Req() req: any) {
    const userId = req?.user?.sub;
    return this.taskService.getTasks(userId, query);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.sub;
    return this.taskService.update(userId, id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req?.user?.sub;
    return this.taskService.remove(userId, id);
  }

  @Post(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.sub;
    return this.taskService.updateStatus(userId, id, updateTaskStatusDto);
  }
}
