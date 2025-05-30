import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { TransformInterceptor, LoggingInterceptor } from './common/interceptors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  })

  // Security
  app.use(helmet())
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })

  // Global prefix
  app.setGlobalPrefix('api')

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter())

  // Global interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
  )

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('EveraPharma API')
    .setDescription('The EveraPharma B2B Pharmaceutical Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('products', 'Product management')
    .addTag('orders', 'Order management')
    .addTag('quotes', 'Quote management')
    .addTag('companies', 'Company management')
    .addTag('users', 'User management')
    .addTag('portal', 'Distributor portal endpoints')
    .addTag('admin', 'Admin endpoints')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  // Start server
  const port = process.env.PORT || 4000
  await app.listen(port)
  
  console.log(`🚀 API server running on http://localhost:${port}`)
  console.log(`📚 API documentation available at http://localhost:${port}/api/docs`)
}

bootstrap()