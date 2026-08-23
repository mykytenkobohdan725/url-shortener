import { Inject, Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from '../schemas/url.schema';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private catModel: Model<Url>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  getOriginalUrl(shortCode: string) {}

  createUrl(dto: CreateUrlDto) {
    // TODO: Check projectId
    const data = {
      ...dto,
      shortCode: '',
    };
  }

  deleteUrl() {}
}
