import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// others
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
