import { Controller, Post, Get, Param, Logger, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
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
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly documentsService: DocumentsService,
    private readonly ingestionService: IngestionService,
  ) {}

  @Post('trigger')
  async triggerIngestion(): Promise<any> {
    this.logger.log('Triggering ingestion process');
    const pythonBackendUrl = this.configService.get<string>('PYTHON_BACKEND_URL');
    const processId = uuidv4();

    this.ingestionService.startProcess(processId);

    try {
      const documents = await this.documentsService.findAll();
      const response = await this.httpService.post(`${pythonBackendUrl}/ingest`, { documents }).toPromise();
      this.ingestionService.completeProcess(processId);
      return response.data;
    } catch (error) {
      this.ingestionService.failProcess(processId);
      this.logger.error('Failed to trigger ingestion process', error);
      throw error;
    }
  }

  @Get('status/:id')
  getStatus(@Param('id') id: string) {
    return this.ingestionService.getProcess(id);
  }

  @Get('status')
  getAllStatuse() {
    return this.ingestionService.getAllProcesses();
  }
} 


// temp code to test the python backend --->>>>>
// from flask import Flask, request, jsonify

// app = Flask(__name__)

// @app.route('/ingest', methods=['POST'])
// def ingest():
//     documents = request.json.get('documents', [])
//     # Process documents for LLM training
//     # ...
//     return jsonify({"status": "success", "message": "Documents processed"})

// if __name__ == '__main__':
//     app.run(port=5000) // this is the port of the python backend