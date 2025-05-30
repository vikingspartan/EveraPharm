import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';
import { DatabaseModule } from '../database/database.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [DatabaseModule, OrdersModule],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
  exports: [AdminService, AdminGuard],
})
export class AdminModule {} 