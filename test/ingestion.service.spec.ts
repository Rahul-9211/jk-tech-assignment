import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from '../src/ingestion/ingestion.service';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';

describe('IngestionService', () => {
  let service: IngestionService;
  let clientProxyMock: Partial<ClientProxy>;

  beforeEach(async () => {
    clientProxyMock = {
      send: jest.fn().mockReturnValue(of('success')),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        { provide: 'ClientProxy', useValue: clientProxyMock },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should start a process', () => {
    service.startProcess('test-id');
    const process = service.getProcess('test-id');
    expect(process).toBeDefined();
    expect(process?.status).toBe('running');
  });

  it('should complete a process', async () => {
    service.startProcess('test-id');
    await service.triggerIngestion([], 'test-id');
    const process = service.getProcess('test-id');
    expect(process?.status).toBe('completed');
  });

  it('should fail a process on error', async () => {
    jest.spyOn(clientProxyMock, 'send').mockReturnValueOnce(throwError(() => new Error('Failed')));

    service.startProcess('test-id');
    await expect(service.triggerIngestion([], 'test-id')).rejects.toThrow('Failed');
    const process = service.getProcess('test-id');
    expect(process?.status).toBe('failed');
  });
}); 