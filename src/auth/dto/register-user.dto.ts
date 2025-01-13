import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  role: UserRole;
} 