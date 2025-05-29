import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'

// Config
import configuration from './config/configuration'

// Modules
import { DatabaseModule } from './modules/database/database.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { CompaniesModule } from './modules/companies/companies.module'
import { ProductsModule } from './modules/products/products.module'
import { OrdersModule } from './modules/orders/orders.module'
import { QuotesModule } from './modules/quotes/quotes.module'
import { DocumentsModule } from './modules/documents/documents.module'
import { AnalyticsModule } from './modules/analytics/analytics.module'
import { EmailModule } from './modules/email/email.module'
import { PaymentModule } from './modules/payment/payment.module'
import { SearchModule } from './modules/search/search.module'
import { CacheModule } from './modules/cache/cache.module'
import { StorageModule } from './modules/storage/storage.module'
import { HealthModule } from './modules/health/health.module'
import { WebsocketModule } from './modules/websocket/websocket.module'

// Portal & Admin modules
import { PortalModule } from './modules/portal/portal.module'
import { AdminModule } from './modules/admin/admin.module'

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('throttle.ttl'),
        limit: config.get('throttle.limit'),
      }),
    }),

    // Core modules
    DatabaseModule,
    CacheModule,
    StorageModule,
    EmailModule,
    SearchModule,
    
    // Feature modules
    AuthModule,
    UsersModule,
    CompaniesModule,
    ProductsModule,
    OrdersModule,
    QuotesModule,
    DocumentsModule,
    AnalyticsModule,
    PaymentModule,
    
    // Portal & Admin
    PortalModule,
    AdminModule,
    
    // Utilities
    HealthModule,
    WebsocketModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}