import { Test, TestingModule } from '@nestjs/testing';
import { LogsActivitiesService } from './logs-activities.service';

describe('LogsActivitiesService', () => {
  let service: LogsActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsActivitiesService],
    }).compile();

    service = module.get<LogsActivitiesService>(LogsActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
