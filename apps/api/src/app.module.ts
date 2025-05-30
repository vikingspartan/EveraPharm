import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
// import { PrescriptionsModule } from './prescriptions/prescriptions.module';
// import { InventoryModule } from './inventory/inventory.module';
// import { CategoriesModule } from './categories/categories.module';
// import { SuppliersModule } from './suppliers/suppliers.module';
// import { AnalyticsModule } from './analytics/analytics.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    AdminModule,
    // PrescriptionsModule,
    // InventoryModule,
    // CategoriesModule,
    // SuppliersModule,
    // AnalyticsModule,
    HealthModule,
  ],
})
export class AppModule {} 