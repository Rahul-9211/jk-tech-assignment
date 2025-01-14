import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

/**
 * Service to manage document operations.
 */
@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  /**
   * Creates a new document.
   * @param createDocumentDto - Data transfer object for creating a document.
   * @param filePath - Path to the uploaded file.
   * @returns The created document.
   */
  async create(createDocumentDto: CreateDocumentDto, filePath: string): Promise<Document> {
    this.logger.log(`Saving document with title: ${createDocumentDto.title}`);
    const document = this.documentsRepository.create({
      ...createDocumentDto,
      filePath,
    });
    return this.documentsRepository.save(document);
  }

  async findAll(): Promise<Document[]> {
    this.logger.log('Retrieving all documents');
    return this.documentsRepository.find();
  }

  async findOne(id: string): Promise<Document> {
    this.logger.log(`Retrieving document with ID: ${id}`);
    const document = await this.documentsRepository.findOne({ where: { id } });
    if (!document) {
      this.logger.warn(`Document with ID: ${id} not found`);
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    this.logger.log(`Updating document with ID: ${id} ${updateDocumentDto}`);
    await this.documentsRepository.update(id, updateDocumentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing document with ID: ${id}`);
    const result = await this.documentsRepository.delete(id); // soft delete
    if (result.affected === 0) {
      this.logger.warn(`Document with ID: ${id} not found`);
      throw new NotFoundException('Document not found');
    }
  }
} 