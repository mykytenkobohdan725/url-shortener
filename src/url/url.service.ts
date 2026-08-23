import {
  Inject,
  Injectable,
  InternalServerErrorException,
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

  getOriginalUrl(shortCode: string) {}

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
