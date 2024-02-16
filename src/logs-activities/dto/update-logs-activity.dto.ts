import { PartialType } from '@nestjs/swagger';
import { CreateLogsActivityDto } from './create-logs-activity.dto';

export class UpdateLogsActivityDto extends PartialType(CreateLogsActivityDto) {}
