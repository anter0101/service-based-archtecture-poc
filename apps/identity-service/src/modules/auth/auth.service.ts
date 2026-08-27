import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { mapUserToDtoSelective } from '../user/user.mapper';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDTO) {
    const existing = await this.userService.findByFields({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = new User();
    user.name = dto.name;
    user.email = dto.email;
    user.passwordHash = dto.password;
    const saved = await this.userService.save(user);
    return this.issue(saved);
  }

  async login(dto: LoginDTO) {
    const user = await this.userService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matches = await compare(dto.password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issue(user);
  }

  private issue(user: User) {
    return {
      accessToken: this.jwtService.sign({
        sub: String(user.id),
        email: user.email,
      }),
      user: mapUserToDtoSelective(user),
    };
  }
}
