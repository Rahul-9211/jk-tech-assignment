import { IsArray, IsString } from 'class-validator';

export class UpdateUserPermissionsDto {
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
} 