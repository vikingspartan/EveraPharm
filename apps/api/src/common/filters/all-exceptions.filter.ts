import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common'
  import { Request, Response } from 'express'
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp()
      const response = ctx.getResponse<Response>()
      const request = ctx.getRequest<Request>()
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR
      let message = 'Internal server error'
      let error = 'Internal Server Error'
  
      if (exception instanceof HttpException) {
        status = exception.getStatus()
        const exceptionResponse = exception.getResponse()
        
        if (typeof exceptionResponse === 'object') {
          message = (exceptionResponse as any).message || exception.message
          error = (exceptionResponse as any).error || exception.name
        } else {
          message = exceptionResponse
        }
      } else if (exception instanceof Error) {
        message = exception.message
        error = exception.name
        
        // Log unexpected errors
        console.error('Unexpected error:', exception)
      }
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        error,
        message,
      })
    }
  }