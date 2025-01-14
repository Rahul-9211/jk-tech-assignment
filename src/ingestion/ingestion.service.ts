import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

export interface IngestionProcess {
  id: string;
  status: 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
}

@Injectable()
export class IngestionService {
  private client: ClientProxy;
  private processes: Map<string, IngestionProcess> = new Map();

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'ingestion_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async triggerIngestion(documents: any[], processId: string) {
    this.startProcess(processId);
    try {
      const result = await this.client.send({ cmd: 'ingest' }, documents).toPromise();
      this.completeProcess(processId);
      return result;
    } catch (error) {
      this.failProcess(processId);
      throw error;
    }
  }

  startProcess(id: string): void {
    this.processes.set(id, {
      id,
      status: 'running',
      startTime: new Date(),
    });
  }

  completeProcess(id: string): void {
    const process = this.processes.get(id);
    if (process) {
      process.status = 'completed';
      process.endTime = new Date();
    }
  }

  failProcess(id: string): void {
    const process = this.processes.get(id);
    if (process) {
      process.status = 'failed';
      process.endTime = new Date();
    }
  }

  getProcess(id: string): IngestionProcess | undefined {
    return this.processes.get(id);
  }

  getAllProcesses(): IngestionProcess[] {
    return Array.from(this.processes.values());
  }
}