import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Typesense from 'typesense'
import { Product } from '@everapharm/database'

@Injectable()
export class SearchService {
  private client: Typesense.Client

  constructor(private configService: ConfigService) {
    this.client = new Typesense.Client({
      nodes: [{
        host: this.configService.get('search.typesense.host'),
        port: this.configService.get('search.typesense.port'),
        protocol: this.configService.get('search.typesense.protocol'),
      }],
      apiKey: this.configService.get('search.typesense.apiKey'),
      connectionTimeoutSeconds: 2,
    })
  }

  async indexProduct(product: Product): Promise<void> {
    try {
      await this.client.collections('products').documents().upsert({
        id: product.id,
        sku: product.sku,
        name: product.name,
        genericName: product.genericName || '',
        description: product.description || '',
        category: product.categoryId,
        division: product.division,
        dosageForm: product.dosageForm || '',
        manufacturer: product.manufacturer || '',
        certifications: product.certifications,
        price: Number(product.basePrice),
        inStock: product.stock > 0,
        popularity: product.orderCount,
      })
    } catch (error) {
      console.error('Failed to index product:', error)
    }
  }

  async searchProducts(query: string, filters?: any) {
    try {
      const searchParameters = {
        q: query,
        query_by: 'name,genericName,description,sku',
        filter_by: this.buildFilterString(filters),
        sort_by: filters?.sortBy || 'popularity:desc',
        per_page: filters?.limit || 20,
        page: filters?.page || 1,
      }

      const results = await this.client
        .collections('products')
        .documents()
        .search(searchParameters)

      return results
    } catch (error) {
      console.error('Search error:', error)
      return null
    }
  }

  private buildFilterString(filters: any): string {
    const filterParts: string[] = []

    if (filters?.category) {
      filterParts.push(`category:=${filters.category}`)
    }

    if (filters?.division) {
      filterParts.push(`division:=${filters.division}`)
    }

    if (filters?.inStock !== undefined) {
      filterParts.push(`inStock:=${filters.inStock}`)
    }

    if (filters?.minPrice !== undefined) {
      filterParts.push(`price:>=${filters.minPrice}`)
    }

    if (filters?.maxPrice !== undefined) {
      filterParts.push(`price:<=${filters.maxPrice}`)
    }

    return filterParts.join(' && ')
  }
}