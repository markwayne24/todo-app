import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'johnDoe@todoapp.com',
    default: 'johnDoe@todoapp.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
    default: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The password for the user account (minimum 6 characters)',
    example: 'password123',
    default: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
