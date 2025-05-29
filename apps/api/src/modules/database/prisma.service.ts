import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@everapharm/database'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    })
  }

  async onModuleInit() {
    await this.$connect()
    
    // Add middleware for soft deletes
    this.$use(async (params, next) => {
      // Check for soft delete models
      const softDeleteModels = ['Company', 'User', 'Document']
      
      if (softDeleteModels.includes(params.model)) {
        // Exclude soft deleted records for findMany and findFirst
        if (params.action === 'findMany' || params.action === 'findFirst') {
          if (!params.args) {
            params.args = {}
          }
          if (!params.args.where) {
            params.args.where = {}
          }
          if (params.args.where.deletedAt === undefined) {
            params.args.where.deletedAt = null
          }
        }
        
        // Convert delete to soft delete
        if (params.action === 'delete') {
          params.action = 'update'
          params.args.data = { deletedAt: new Date() }
        }
        
        // Convert deleteMany to soft delete
        if (params.action === 'deleteMany') {
          params.action = 'updateMany'
          if (!params.args) {
            params.args = {}
          }
          params.args.data = { deletedAt: new Date() }
        }
      }
      
      return next(params)
    })
    
    // Add middleware for audit logging
    this.$use(async (params, next) => {
      const auditActions = ['create', 'update', 'delete', 'createMany', 'updateMany', 'deleteMany']
      const auditModels = ['Product', 'Order', 'Company', 'User']
      
      if (auditActions.includes(params.action) && auditModels.includes(params.model)) {
        const before = params.action.includes('update') || params.action.includes('delete')
          ? await this[params.model.toLowerCase()].findFirst({ where: params.args.where })
          : null
          
        const result = await next(params)
        
        // Create audit log entry
        // This would be handled by a separate audit service in production
        try {
          await this.auditLog.create({
            data: {
              action: params.action,
              tableName: params.model,
              recordId: result?.id || (params.args.where?.id as string),
              oldValues: before ? JSON.parse(JSON.stringify(before)) : null,
              newValues: result ? JSON.parse(JSON.stringify(result)) : null,
              userId: (params as any).userId || null, // Would be set by the request context
              ipAddress: (params as any).ipAddress || null,
              userAgent: (params as any).userAgent || null,
            },
          })
        } catch (error) {
          console.error('Failed to create audit log:', error)
        }
        
        return result
      }
      
      return next(params)
    })
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
  
  // Utility method for transactions
  async transaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(fn)
  }
  
  // Utility method for raw queries
  async raw<T = any>(query: string, values?: any[]): Promise<T> {
    return this.$queryRawUnsafe<T>(query, ...(values || []))
  }
}