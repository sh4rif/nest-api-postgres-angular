import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { UserService } from '../services/user.service';
import * as express from 'express';

@Controller('users')
export class UserController {
  constructor(private usrService: UserService) {}

  @Get()
  getAll(): Observable<User[]> {
    return this.usrService.findALl();
  }

  @Post()
  async create(@Body() payload: User, res: express.Response) {
    // return this.usrService.create(payload);
    try {
      return await this.usrService.create(payload);
    } catch (error) {
      console.log('error', error);
      return res.send(error);
    }
    // return this.usrService.create(payload, res);
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
}
