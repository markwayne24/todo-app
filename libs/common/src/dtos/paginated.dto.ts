import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { toNumber } from '@/common/helpers/cast.helper';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto {
  @ApiProperty({
    description: 'Number of items to return per page (1-100)',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    toNumber(value, { default: 10, min: 1, max: 100 }),
  )
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({
    description: 'Number of items to skip (for pagination)',
    example: 0,
    default: 0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    toNumber(value, { default: 0, min: 0 }),
  )
  @IsNumber()
  @Min(0)
  skip?: number;
}
