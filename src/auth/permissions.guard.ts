import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }
    if(user.role === UserRole.ADMIN){
      return true;
    }

    const hasPermission = requiredPermissions.every(permission => user.permissions.includes(permission));
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
    return true;
  }
} 