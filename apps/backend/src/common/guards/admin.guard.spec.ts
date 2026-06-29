import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { JwtPayload } from '../decorators/current-user.decorator';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    guard = new AdminGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should throw UnauthorizedException if there is an error', () => {
      const error = new Error('JWT error');
      expect(() => guard.handleRequest(error, false)).toThrow(
        new UnauthorizedException('JWT error'),
      );
    });

    it('should throw UnauthorizedException if user is false/missing', () => {
      expect(() => guard.handleRequest(null, false)).toThrow(
        new UnauthorizedException('Unauthorized'),
      );
    });

    it('should throw ForbiddenException if user role is not admin', () => {
      const user: JwtPayload = { sub: '123', email: 'user@example.com', role: 'user' };
      expect(() => guard.handleRequest(null, user)).toThrow(
        new ForbiddenException('Admin access required'),
      );
    });

    it('should throw ForbiddenException if user role is undefined', () => {
      const user: JwtPayload = { sub: '123', email: 'user@example.com' };
      expect(() => guard.handleRequest(null, user)).toThrow(
        new ForbiddenException('Admin access required'),
      );
    });

    it('should return user if user role is admin', () => {
      const user: JwtPayload = { sub: '123', email: 'admin@example.com', role: 'admin' };
      const result = guard.handleRequest(null, user);
      expect(result).toEqual(user);
    });
  });
});
