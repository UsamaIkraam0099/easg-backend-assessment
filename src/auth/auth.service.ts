import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

// others
import { AuthDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async signUp(dto: AuthDto) {
    try {
      // generate the pssword hash
      const hash = await argon.hash(dto.password);

      // save the new user in the DB
      const user = await this.prisma.user.create({
        data: {
          hash,
          name: dto.name,
          email: dto.email,
        },
      });

      const { access_token } = await this.signToken(user.id, user.email);

      delete user.hash;

      return {
        userDetails: user,
        accessToken: access_token,
      };
    } catch (error) {
      throw new ForbiddenException('User already exist with same email');
    }
  }

  async signIn(dto: AuthDto) {
    try {
      // find the user by email
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      // compare password
      const pwMatches = await argon.verify(user.hash, dto.password);

      // if password incorrect throw exception
      if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

      const { access_token } = await this.signToken(user.id, user.email);

      delete user.hash;

      // send back user with access token
      return {
        userDetails: user,
        accessToken: access_token,
      };
    } catch (error) {
      throw new NotFoundException('User not found!');
    }
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token };
  }
}
