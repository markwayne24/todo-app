import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'johnDoe@todoapp.com',
    default: 'johnDoe@todoapp.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'password123',
    default: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
