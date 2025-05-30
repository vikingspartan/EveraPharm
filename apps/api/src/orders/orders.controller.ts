import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: any) {
    return this.ordersService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.findOne(id, req.user.id, req.user.role);
  }

  @Post(':id/prescription')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPrescription(
    @Request() req: any,
    @Param('id') id: string,
    @Body() prescriptionData: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!prescriptionData.doctorName || !prescriptionData.doctorLicense) {
      throw new BadRequestException('Doctor information is required');
    }

    // In production, we would upload the file to S3 or similar
    // For now, we'll just store a mock URL
    const documentUrl = file ? `/prescriptions/${id}/${file.originalname}` : null;

    return this.ordersService.addPrescription(id, req.user.id, {
      ...prescriptionData,
      documentUrl,
    });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    if (!Object.values(OrderStatus).includes(status)) {
      throw new BadRequestException('Invalid order status');
    }
    
    return this.ordersService.updateStatus(id, status, req.user.role);
  }
} 