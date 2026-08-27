import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify, type SignOptions } from 'jsonwebtoken';

export type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  sign(payload: JwtPayload): string {
    const options: SignOptions = { expiresIn: this.expiresIn };
    return sign(payload, this.secret, options);
  }

  verify(token: string): JwtPayload {
    return verify(token, this.secret) as unknown as JwtPayload;
  }

  private get secret(): string {
    return this.configService.get<string>('JWT_SECRET', 'change-me');
  }

  private get expiresIn(): SignOptions['expiresIn'] {
    return (this.configService.get<string>('JWT_EXPIRES_IN') ??
      '15m') as SignOptions['expiresIn'];
  }
}
