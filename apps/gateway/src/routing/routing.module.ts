import { Global, Module } from '@nestjs/common';
import { ServiceRouter } from './service-router';

@Global()
@Module({
  providers: [ServiceRouter],
  exports: [ServiceRouter],
})
export class RoutingModule {}
