import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum(['pending', 'completed', 'cancelled', 'in-progress', 'overdue'])
  @IsOptional()
  status: 'pending' | 'completed' | 'cancelled' | 'in-progress' | 'overdue';
}
