import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { customAlphabet } from 'nanoid';
import { Model, Types } from 'mongoose';
import { Url } from '../schemas/url.schema';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

const alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const generateCode = customAlphabet(alphabet, 6);

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getOriginalUrl(shortCode: string, projectId: string) {
    const cacheKey = `url:${projectId}:${shortCode}`;
    const cachedUrl = await this.cacheManager.get<string>(cacheKey);

    if (cachedUrl) {
      return cachedUrl;
    }

    const url = await this.urlModel
      .findOne({
        shortCode,
        project: projectId,
      })
      .exec();

    if (!url) {
      throw new NotFoundException();
    }

    await this.cacheManager.set(cacheKey, url?.originalUrl);

    return url?.originalUrl;
  }

  async createUrl({ originalUrl, expiresAt }: CreateUrlDto, projectId: string) {
    let shortCode: string = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      shortCode = generateCode();
      const existing = await this.urlModel
        .findOne({ shortCode })
        .select({ _id: 1 })
        .exec();
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new InternalServerErrorException();
    }

    return this.urlModel.create({
      originalUrl,
      shortCode,
      expiresAt,
      project: new Types.ObjectId(projectId),
    });
  }

  deleteUrl() {}
}
