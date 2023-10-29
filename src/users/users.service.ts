import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUses() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findById(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
