import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import fastifyCsrf from "@fastify/csrf-protection";
import helmet from "@fastify/helmet";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Helmet
  await app.register(helmet);

  // Enable CORS
  app.enableCors();

  // CSRF
  await app.register(fastifyCsrf);

  await app.listen(3000);
}
bootstrap();
