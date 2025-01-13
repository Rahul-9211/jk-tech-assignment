import { Controller, Post, Body, Get, Param, Delete, Patch, UseInterceptors, UploadedFile, Logger, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './document.entity';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CREATE_PERMISSION, DELETE_PERMISSION, READ_PERMISSION, UPDATE_PERMISSION } from 'src/constants/permision.constants';

@Controller('documents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);

  constructor(private readonly documentsService: DocumentsService) {}

  @Permissions(CREATE_PERMISSION)
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
    this.logger.log(`Creating document with title: ${createDocumentDto.title}`);
    const filePath = file.path;
    return this.documentsService.create(createDocumentDto, filePath);
  }

  @Permissions(READ_PERMISSION)
  @Get()
  async findAll(): Promise<Document[]> {
    this.logger.log('Fetching all documents');
    return this.documentsService.findAll();
  }

  @Permissions(READ_PERMISSION)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Document> {
    this.logger.log(`Fetching document with ID: ${id}`);
    return this.documentsService.findOne(id);
  }

  @Permissions(UPDATE_PERMISSION)
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
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Document> {
    this.logger.log(`Updating document with ID: ${id}`);
    if (file) {
      updateDocumentDto.filePath = file.path;
    }
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Permissions(DELETE_PERMISSION)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deleting document with ID: ${id}`);
    return this.documentsService.remove(id);
  }
} 