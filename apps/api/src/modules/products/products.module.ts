import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { CacheModule } from '../cache/cache.module'
import { SearchModule } from '../search/search.module'

@Module({
  imports: [CacheModule, SearchModule],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}