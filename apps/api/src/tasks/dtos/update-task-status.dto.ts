import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskStatusDto {
  @ApiProperty({
    description: 'The new status of the task',
    example: 'completed',
    default: 'completed',
    enum: ['pending', 'completed', 'cancelled', 'in-progress', 'overdue'],
  })
  @IsEnum(['pending', 'completed', 'cancelled', 'in-progress', 'overdue'])
  @IsOptional()
  status: 'pending' | 'completed' | 'cancelled' | 'in-progress' | 'overdue';
}
