/*external modules*/
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private connection: Redis.Redis;

  async onModuleInit() {
    this.createConnection();
  }

  async onModuleDestroy() {
    await this.closeConnection();
  }

  private createConnection() {
    this.connection = new Redis({
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
      keyPrefix: `${process.env.ENV_NAME}:`,
    });
  }

  private async closeConnection() {
    await this.connection.quit();
  }

  public getConnection() {
    return this.connection;
  }
}
