import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client = new Redis();

  onModuleInit() {
    this.client = new Redis({
      host: "localhost"
    })
  }

  async set(key: string, code: string, second: number) {
    await this.client.set(key, code, "EX", second)
  }

  async get(key: string) {
    return await this.client.get(key)
  }

  async delete(key: string) {
    await this.client.del(key)
  }
}