import { Controller, Post, Body, Get, Param, Delete, Patch, UseInterceptors, UploadedFile, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './document.entity';

@Controller('documents')
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);

  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Document> {
    // console.log(file);
    this.logger.log(`Creating document with title: ${createDocumentDto.title}`);
    const filePath = file.path;
    return this.documentsService.create(createDocumentDto, filePath);
  }

  @Get()
  async findAll(): Promise<Document[]> {
    this.logger.log('Fetching all documents');
    return this.documentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Document> {
    this.logger.log(`Fetching document with ID: ${id}`);
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    this.logger.log(`Updating document with ID: ${id}`);
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deleting document with ID: ${id}`);
    return this.documentsService.remove(id);
  }
} 