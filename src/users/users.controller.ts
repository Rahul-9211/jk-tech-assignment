import { Controller, Post, Body, Get, UseGuards, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User> {
    return this.usersService.updateRole(id, updateUserRoleDto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/permissions')
  async updatePermissions(
    @Param('id') id: string,
    @Body() updateUserPermissionsDto: UpdateUserPermissionsDto,
  ): Promise<User> {
    return this.usersService.updatePermissions(id, updateUserPermissionsDto);
  }
} 