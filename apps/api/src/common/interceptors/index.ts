import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common'
  import { Observable } from 'rxjs'
  import { tap, map } from 'rxjs/operators'
  
  // Transform Interceptor - standardizes response format
  @Injectable()
  export class TransformInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => ({
          success: true,
          data,
          timestamp: new Date().toISOString(),
        })),
      )
    }
  }
  
  // Logging Interceptor - logs request/response
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest()
      const method = request.method
      const url = request.url
      const now = Date.now()
  
      return next.handle().pipe(
        tap(() => {
          const response = context.switchToHttp().getResponse()
          const delay = Date.now() - now
          console.log(
            `${method} ${url} ${response.statusCode} - ${delay}ms`,
          )
        }),
      )
    }
  }