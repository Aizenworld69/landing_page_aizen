import { Injectable, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  handleRequest<TUser extends JwtPayload>(err: Error | null, user: TUser | false): TUser {
    if (err || !user) throw err ?? new ForbiddenException('Unauthorized');
    // Supabase JWT có role trong app_metadata
    const role = (user as JwtPayload & { app_metadata?: { role?: string } }).role
      ?? ((user as unknown) as { app_metadata?: { role?: string } }).app_metadata?.role;
    if (role !== 'admin') throw new ForbiddenException('Admin access required');
    return user;
  }
}