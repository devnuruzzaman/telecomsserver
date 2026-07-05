import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { RechargeService } from './recharge.service';

@Injectable()
@Processor('recharge-processing-queue')
export class RechargeProcessor extends WorkerHost {
  private readonly logger = new Logger(RechargeProcessor.name);

  constructor(private readonly rechargeService: RechargeService) {
    super();
  }

  /**
   * BullMQ Worker Runner
   * Resolves asynchronous operator handshakes and controls automatic retry loops
   */
  async process(job: Job<any, any, string>): Promise<any> {
    const { rechargeId } = job.data;
    this.logger.log(`Starting processing for Recharge Job: [${job.id}] | Entity Reference: [${rechargeId}]`);

    try {
      // 1. Handshake gateway and credit balances
      await this.rechargeService.processRechargeWorker(rechargeId);
      
      this.logger.log(`Successfully completed Recharge Job: [${job.id}]`);
      return { success: true, rechargeId };
    } catch (error) {
      this.logger.error(`Fatal failure processing Recharge Job [${job.id}]: ${error.message}`, error.stack);
      
      // Control queue backoff/retry parameters
      if (job.attemptsMade < 3) {
        throw new Error(`Temporary Gateway Timeout. Retrying step. Attempt: ${job.attemptsMade + 1}`);
      }
      
      return { success: false, error: error.message };
    }
  }
}
