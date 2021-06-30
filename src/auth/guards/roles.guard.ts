import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/users/models/user.interface';

import { UserService } from 'src/users/services/user.service';

function matchRoles(roles, user_roles): boolean {
  return true;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    return this.userService.profile(user.id).pipe(
      map((user: User) => {
        let hasPermission: boolean = roles.indexOf(user.role) > -1;

        return true && hasPermission;
      }),
    );
  }
}
