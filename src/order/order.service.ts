import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { ProductService } from "src/product/product.service";

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async create(user: any, createOrderDtos: CreateOrderDto[]) {
    const totalQuantity = createOrderDtos.reduce(
      (acc, current) => acc + current.quantity,
      0,
    );
    console.log("Total quantity:", totalQuantity);
    try {
      const orders = await Promise.all(
        createOrderDtos.map(async (createOrderDto) => {
          const product = await this.prisma.product.findUnique({
            where: {
              id: createOrderDto.productId,
            },
          });

          const updatedProduct = await this.prisma.product.update({
            where: {
              id: createOrderDto.productId,
            },
            data: {
              quantity: product.quantity - totalQuantity,
            },
          });

          if (!updatedProduct) {
            throw new Error(
              `Failed to update product with ID ${createOrderDto.productId}`,
            );
          }
          const orderCreate = await this.prisma.order.create({
            data: {
              userId: user.userId,
              productId: createOrderDto.productId,
              quantity: createOrderDto.quantity,
            },
          });
          return orderCreate;
        }),
      );

      return orders;
    } catch (e) {
      console.error(e);
    }
  }
  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
