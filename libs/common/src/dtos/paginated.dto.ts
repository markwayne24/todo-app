import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { toNumber } from '@/common/helpers/cast.helper';

export class PaginatedDto {
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    toNumber(value, { default: 10, min: 1, max: 100 }),
  )
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    toNumber(value, { default: 0, min: 0 }),
  )
  @IsNumber()
  @Min(0)
  skip?: number;
}
