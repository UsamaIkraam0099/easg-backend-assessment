import {
  IsEmail,
  IsString,
  IsNotEmpty,
  ValidateIf,
  IsOptional,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((body) => (body.type === 'signIn' ? false : true))
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  type: String;
}
