import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from '../src/documents/documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../src/documents/document.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repository: Repository<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a document', async () => {
    const documentDto = {
      title: 'Test Document',
      description: 'This is a test document',
      filePath: '/path/to/document',
    };

    jest.spyOn(repository, 'save').mockResolvedValue(documentDto as Document);

    const result = await service.create(documentDto, "test-file-path");
    expect(result).toEqual(documentDto);
  });

  it('should find a document by id', async () => {
    const document = {
      id: '1',
      title: 'Test Document',
      description: 'This is a test document',
      filePath: '/path/to/document',
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(document as Document);

    const result = await service.findOne('1');
    expect(result).toEqual(document);
  });

  it('should throw not found exception if document does not exist', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
  });

  it('should update a document', async () => {
    const document = {
      id: '1',
      title: 'Test Document',
      description: 'This is a test document',
      filePath: '/path/to/document',
    };

    const updateDto = {
      title: 'Updated Document',
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(document as Document);
    jest.spyOn(repository, 'save').mockResolvedValue({ ...document, ...updateDto } as Document);

    const result = await service.update('1', updateDto);
    expect(result.title).toEqual('Updated Document');
  });

  it('should delete a document', async () => {
    const document = {
      id: '1',
      title: 'Test Document',
      description: 'This is a test document',
      filePath: '/path/to/document',
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(document as Document);
    jest.spyOn(repository, 'remove').mockResolvedValue(document as Document);

    const result = await service.remove('1');
    expect(result).toEqual(document);
  });
}); 