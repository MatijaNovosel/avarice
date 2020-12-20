import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// import csurf from 'csurf';
// import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  // app.use(csurf());
  await app.listen(3000);
}

bootstrap();
