import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDto } from '@/common/dtos/paginated.dto';

export class GetTasksDto extends PaginatedDto {
  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter tasks by status',
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    example: 'pending',
    required: false,
  })
  @IsEnum(['pending', 'in-progress', 'completed', 'cancelled'])
  @IsOptional()
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';

  @ApiProperty({
    description: 'Filter tasks by priority',
    enum: ['low', 'medium', 'high'],
    example: 'high',
    required: false,
  })
  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  priority?: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'Filter tasks by category',
    enum: ['personal', 'work', 'shopping', 'health', 'education'],
    example: 'work',
    required: false,
  })
  @IsEnum(['personal', 'work', 'shopping', 'health', 'education'])
  @IsOptional()
  category?: 'personal' | 'work' | 'shopping' | 'health' | 'education';

  @ApiProperty({
    description: 'Search tasks by title or description',
    example: 'project',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Sort order (asc or desc)',
    enum: ['asc', 'desc'],
    example: 'desc',
    default: 'desc',
    required: false,
  })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sort?: 'asc' | 'desc' = 'desc';
}
