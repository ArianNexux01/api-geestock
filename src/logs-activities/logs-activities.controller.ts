import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogsActivitiesService } from './logs-activities.service';
import { CreateLogsActivityDto } from './dto/create-logs-activity.dto';
import { UpdateLogsActivityDto } from './dto/update-logs-activity.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('LogsActivities')
@Controller('logs-activities')
export class LogsActivitiesController {
  constructor(private readonly logsActivitiesService: LogsActivitiesService) { }

  @Post()
  create(@Body() createLogsActivityDto: CreateLogsActivityDto) {
    return this.logsActivitiesService.create(createLogsActivityDto);
  }

  @Get()
  findAll() {
    return this.logsActivitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsActivitiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogsActivityDto: UpdateLogsActivityDto) {
    return this.logsActivitiesService.update(id, updateLogsActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logsActivitiesService.remove(id);
  }
}
