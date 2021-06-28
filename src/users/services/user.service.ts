import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// const * as bcrypt = require('bcrypt');

import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: User) {
    const { password, username } = user;
    try {
      const existingUser = this.findByUsername(username);
      // if (existingUser) {
      //   throw new Error('Username already in use');
      // }
      const hashedPwd = await bcrypt.hash(password, 10);
      user.password = hashedPwd;
      console.log('user is', user);
      return await this.userRepository.save(user);
    } catch (error) {
      // console.log('error', error);
      // console.log('error.message', error.message);
      // return res.status(400).json({ error: error.message });
      throw new Error(error.message);
    }
  }

  findByUsername(username: string): Observable<User> {
    return from(this.userRepository.findOne({ username: username }));
  }

  findALl(): Observable<User[]> {
    // Creates an Observable from an Array, an array-like object, a Promise, an iterable object, or an Observable-like object
    // https://rxjs-dev.firebaseapp.com/api/index/function/from
    return from(this.userRepository.find());
  }

  profile(id: number): Observable<User> {
    return from(this.userRepository.findOne(id));
  }

  update(id: number, user: User): Observable<any> {
    return from(this.userRepository.update(id, user));
  }

  delete(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }
}
