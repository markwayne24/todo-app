import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  scheduledTime: string;

  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  priority?: 'low' | 'medium' | 'high';

  @IsEnum(['pending', 'completed', 'cancelled', 'in-progress', 'overdue'])
  @IsOptional()
  status?: 'pending' | 'completed' | 'cancelled' | 'in-progress' | 'overdue';

  @IsString()
  @IsOptional()
  category?: string;
}
