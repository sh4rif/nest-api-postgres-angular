import { Body, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User, UserRole } from '../models/user.interface';
import { UserService } from '../services/user.service';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuar } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(private usrService: UserService) {}

  @Get()
  getAll(): Observable<User[]> {
    return this.usrService.findALl();
  }

  @Post()
  create(@Body() payload: User): Observable<User | Object> {
    return this.usrService.create(payload).pipe(
      map((user: User) => user),
      catchError((err) => {
        return of({ error: err.message });
      }),
    );
  }

  @Post('login')
  login(@Body() payload: User): Observable<Object> {
    return this.usrService.login(payload).pipe(
      map((jwt: string) => {
        // console.log('user is', payload)
        return { accessToken: jwt };
      }),
    );
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<User> {
    return this.usrService.profile(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: User): Observable<User> {
    return this.usrService.update(Number(id), payload);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<User> {
    return this.usrService.delete(Number(id));
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuar, RolesGuard)
  @Put(':id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ): Observable<any> {
    return this.usrService.updateUserRole(Number(id), role);
  }
}
