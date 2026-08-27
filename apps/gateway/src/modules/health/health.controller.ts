import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { services } from '@app/common';

@Controller('api/health')
@ApiTags('health-module')
export class HealthController {
  @Get('/')
  @ApiOperation({ summary: 'Health check' })
  check() {
    return { status: 'ok', service: services.gateway.name };
  }
}
