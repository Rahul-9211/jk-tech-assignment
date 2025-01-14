import { Injectable } from '@nestjs/common';

export interface IngestionProcess {
  id: string;
  status: 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
}

@Injectable()
export class IngestionService {
  private processes: Map<string, IngestionProcess> = new Map();

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