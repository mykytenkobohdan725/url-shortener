import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from '../schemas/url.schema';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private catModel: Model<Url>) {}

  getUrl(shortCode: string) {}

  createUrl(dto: CreateUrlDto) {
    const data = {
      ...dto,
      shortCode: '',
    };
  }

  deleteUrl() {}
}
