import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  handleRequest<TUser extends JwtPayload>(err: Error | null, user: TUser | false): TUser {
    if (err || !user) {
      throw err ?? new UnauthorizedException('Unauthorized');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }
    return user;
  }
}