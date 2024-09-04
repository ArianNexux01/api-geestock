import { Test, TestingModule } from '@nestjs/testing';
import { ExcellService } from './excell.service';

describe('ExcellService', () => {
  let service: ExcellService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcellService],
    }).compile();

    service = module.get<ExcellService>(ExcellService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
