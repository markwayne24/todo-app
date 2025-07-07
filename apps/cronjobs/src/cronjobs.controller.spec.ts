import { Test, TestingModule } from '@nestjs/testing';
import { CronjobsController } from './cronjobs.controller';
import { CronjobsService } from './cronjobs.service';

describe('CronjobsController', () => {
  let cronjobsController: CronjobsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CronjobsController],
      providers: [CronjobsService],
    }).compile();

    cronjobsController = app.get<CronjobsController>(CronjobsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(cronjobsController.getHello()).toBe('Hello World!');
    });
  });
});
