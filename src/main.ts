import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// others
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3300);
}
bootstrap();
