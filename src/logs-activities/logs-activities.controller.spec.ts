import { Test, TestingModule } from '@nestjs/testing';
import { LogsActivitiesController } from './logs-activities.controller';
import { LogsActivitiesService } from './logs-activities.service';

describe('LogsActivitiesController', () => {
  let controller: LogsActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsActivitiesController],
      providers: [LogsActivitiesService],
    }).compile();

    controller = module.get<LogsActivitiesController>(LogsActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
