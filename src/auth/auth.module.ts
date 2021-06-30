import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthGuar } from './guards/jwt-auth.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          signOptions: { expiresIn: '30m' },
        };
      },
    }),
  ],
  providers: [AuthService, RolesGuard, JwtAuthGuar, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
