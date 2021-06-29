import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.interface';
import { UserService } from '../services/user.service';
import * as express from 'express';
import { catchError, map } from 'rxjs/operators';

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
      catchError((err)=> {
        return of({error: err.message})
      } )
    )
  }

  @Post('login')
  login(@Body() payload: User): Observable<Object>{
    return this.usrService.login(payload).pipe(map((jwt: string)=> {
      return {accessToken: jwt}
    }))
  }

  // @Post()
  // async create(@Body() payload: User, res: express.Response) {
  //   // return this.usrService.create(payload);
  //   try {
  //     return await this.usrService.create(payload);
  //   } catch (error) {
  //     console.log('error', error);
  //     return res.send(error);
  //   }
  //   // return this.usrService.create(payload, res);
  // }

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
}
