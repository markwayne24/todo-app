import { PaginatedDto } from '@/common/dtos/paginated.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetTasksDto extends PaginatedDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high' = 'medium';

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
