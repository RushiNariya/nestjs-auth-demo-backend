import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto, SendOtpDto, VerifyOTPDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          contains: email,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const checkPass = await bcrypt.compare(pass, user.passwordHash);

    if (!checkPass) {
      throw new UnauthorizedException('incorrect password');
    }

    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRE'),
      }),
    };
  }
  async register(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          contains: email,
        },
      },
    });

    if (user) {
      throw new ForbiddenException('User already exist');
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(pass, saltOrRounds);

    const newUser = await this.prisma.user.create({
      data: {
        email: email,
        passwordHash: hash,
      },
    });

    return {
      data: {
        email: newUser.email,
        id: newUser.id,
        createdAt: newUser.createdAt,
      },
    };
  }
  async logout(authUser: any) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: authUser.id,
      },
    });

    if (!user) {
      throw new ForbiddenException('user not found');
    }
    return true;
  }
  async sendOTP(body: SendOtpDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const val = Math.floor(1000 + Math.random() * 9000);

    const newCode = await this.prisma.code.upsert({
      where: {
        userId: user.id,
      },
      create: {
        code: val.toString(),
        userId: user.id,
      },
      update: {
        code: val.toString(),
      },
    });

    return {
      code: newCode.code,
      email: body.email,
    };
  }
  async verifyOTP(body: VerifyOTPDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const code = await this.prisma.code.findFirst({
      where: {
        code: body.OTP.toString(),
        userId: user.id,
      },
    });

    if (!code) {
      throw new BadRequestException('invalid OTP');
    }

    return {
      email: body.email,
    };
  }
  async resetPassword(body: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    const userCode = await this.prisma.code.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (!userCode || userCode.code !== body.OTP.toString()) {
      throw new ForbiddenException('verify email and OTP first');
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(body.password, saltOrRounds);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash: hash,
      },
    });

    const code = await this.prisma.code.delete({
      where: {
        userId: user.id,
      },
    });

    return {
      user: updatedUser.id,
      email: updatedUser.email,
    };
  }
}
