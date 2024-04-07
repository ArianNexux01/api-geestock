import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Dashboard")
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get()
  findAll() {
    return this.dashboardService.findAll();
  }

  @Get("/all-by-user/:warehouseId")
  findAllAllByUser(@Param("warehouseId") warehouseId: string) {
    return this.dashboardService.findAllByUser(warehouseId);
  }
}
