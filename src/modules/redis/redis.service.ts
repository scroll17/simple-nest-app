/*external modules*/
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private connection: Redis.Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.createConnection();
  }

  async onModuleDestroy() {
    await this.closeConnection();
  }

  private createConnection() {
    this.connection = new Redis({
      port: this.configService.get('redis.port'),
      host: this.configService.get('redis.host'),
      keyPrefix: `${this.configService.get('env')}:`,
    });
  }

  private async closeConnection() {
    await this.connection.quit();
  }

  public getConnection() {
    return this.connection;
  }
}
