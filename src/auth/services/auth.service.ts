import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateJWT(payload: Object): Observable<string> {
    return from(this.jwtService.signAsync(payload));
  }

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12))
  }

  comparePwds(password: string, hashedPwd: string): Observable<any | boolean> {
    return of<any | boolean>(bcrypt.compare(password, hashedPwd));
  }
}
