import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Updated project documentation',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Updated comprehensive documentation for the new API endpoints',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The due date for the task (ISO date string)',
    example: '2024-01-16T10:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({
    description: 'The priority level of the task',
    enum: ['low', 'medium', 'high'],
    example: 'high',
    required: false,
  })
  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  priority?: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'The category of the task',
    enum: ['personal', 'work', 'shopping', 'health', 'education'],
    example: 'personal',
    required: false,
  })
  @IsEnum(['personal', 'work', 'shopping', 'health', 'education'])
  @IsOptional()
  category?: 'personal' | 'work' | 'shopping' | 'health' | 'education';
}
