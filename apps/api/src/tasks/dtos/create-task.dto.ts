import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Complete project documentation',
    default: 'Complete project documentation',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the task',
    example:
      'Write comprehensive documentation for the todo application including API endpoints and setup instructions',
    default: 'Write comprehensive documentation for the todo application',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The due date for the task (ISO date string)',
    example: '2024-01-15T10:00:00.000Z',
    default: '2024-01-15T10:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({
    description: 'Priority level of the task',
    example: 'medium',
    default: 'medium',
    enum: ['low', 'medium', 'high'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high' = 'medium';

  @ApiProperty({
    description: 'Category to organize the task',
    example: 'work',
    default: 'work',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;
}
