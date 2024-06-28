import {Module} from '@nestjs/common';
import {PurchaseOrdersService} from './purchase-orders.service';
import {PurchaseOrdersController} from './purchase-orders.controller';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService, PrismaService],
})
export class PurchaseOrdersModule {
}