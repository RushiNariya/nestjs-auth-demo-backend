import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
      expiresIn: config.get<string>('JWT_EXPIRE'),
    });
  }

  async validate(request: Request, payload: any) {
    const access_token = request
      .get('authorization')
      .replace('Bearer ', '')
      .trim();

    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(payload.sub),
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('unaauthorized access');
    }

    return {
      ...user,
      access_token,
    };
  }
}
