import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    default: 'abc@gmail.com',
    type: 'string',
    description: 'enter your email',
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class AuthDto {
  @ApiProperty({
    default: 'abc@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    default: '12345678',
    description: 'enter password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class VerifyOTPDto {
  @ApiProperty({
    default: 'abc@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  OTP: number;
}

export class ResetPasswordDto {
  @ApiProperty({
    default: 'abc@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  OTP: number;
}
