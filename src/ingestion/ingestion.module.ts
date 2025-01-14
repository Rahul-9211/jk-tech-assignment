import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [HttpModule, DocumentsModule],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {} 