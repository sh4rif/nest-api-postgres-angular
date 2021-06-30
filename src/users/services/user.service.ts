import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  create(user: User): Observable<any> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((hashedPwd: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.username = user.username;
        newUser.password = hashedPwd;
        newUser.role = user.role;

        // const newUser = {...user, password: hashedPwd }
        return from(this.userRepository.save(newUser)).pipe(
          map((user: any) => {
            const { password, ...rest } = user;
            return rest;
          }),
          catchError((err) => throwError(err)),
        );
      }),
    );
  }

  findByUsername(username: string): Observable<any> {
    return from(this.userRepository.findOne({ username }));
  }

  findByEmail(email: string): Observable<any> {
    return from(this.userRepository.findOne({ email }));
  }

  findALl(): Observable<any[]> {
    // Creates an Observable from an Array, an array-like object, a Promise, an iterable object, or an Observable-like object
    // https://rxjs-dev.firebaseapp.com/api/index/function/from
    return from(this.userRepository.find()).pipe(
      map((users: Array<any>) => {
        users.forEach((u) => {
          delete u.password;
        });
        return users;
      }),
    );
  }

  profile(id: number): Observable<any> {
    return from(this.userRepository.findOne(id)).pipe(
      map((user: any) => {
        const { password, ...rest } = user;
        return rest;
      }),
    );
  }

  update(id: number, user: User): Observable<any> {
    delete user.email;
    delete user.password;
    delete user.username;
    return from(this.userRepository.update(id, user));
  }

  delete(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  login(user: User): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService
            .generateJWT(user)
            .pipe(map((jwt: string) => jwt));
        } else {
          return 'Wrong Credientials';
        }
      }),
    );
  }

  updateUserRole(id: number, role: any): Observable<any> {
    return from(this.userRepository.update(id, { role: role }));
  }

  validateUser(email: string, password: string): Observable<any> {
    return from(this.findByEmail(email)).pipe(
      switchMap((user: User) => {
        return this.authService.comparePwds(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...rest } = user;
              return rest;
            }
            throw Error('User does not exists');
          }),
        );
      }),
    );
  }
}
