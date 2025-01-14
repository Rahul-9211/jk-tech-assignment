import { Controller, Post, Get, Param, Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentsService } from '../documents/documents.service';
import { IngestionService } from './ingestion.service';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ingestion')
export class IngestionController {
  private readonly logger = new Logger(IngestionController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly documentsService: DocumentsService,
    private readonly ingestionService: IngestionService,
  ) {}

  @Post('trigger')
  async triggerIngestion(): Promise<any> {
    this.logger.log('Triggering ingestion process');
    const processId = uuidv4();

    try {
      const documents = await this.documentsService.findAll();
      const response = await this.ingestionService.triggerIngestion(documents, processId);
      this.logger.log(`Ingestion process ${processId} completed successfully`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to trigger ingestion process ${processId}`, error);
      throw error;
    }
  }

  @Get('status/:id')
  getStatus(@Param('id') id: string) {
    const status = this.ingestionService.getProcess(id);
    if (!status) {
      this.logger.warn(`No status found for process ID: ${id}`);
      return { message: `No status found for process ID: ${id}` };
    }
    return status;
  }

  @Get('status')
  getAllStatuses() {
    return this.ingestionService.getAllProcesses();
  }
}