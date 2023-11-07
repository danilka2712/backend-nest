import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }
}
