import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { ProxyModule } from './proxy/proxy.module';
import { RoutingModule } from './routing/routing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    AuthModule,
    RoutingModule,
    ProxyModule,
    HealthModule,
  ],
})
export class GatewayModule {}
