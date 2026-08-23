import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UrlService } from './url.service';
import { UseApiKey } from '../decorators/api-key.decorator';
import { CreateUrlDto } from './dto/create-url.dto';
import { ProjectId } from '../decorators/project-id.decorator';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @UseApiKey()
  createUrl(@Body() dto: CreateUrlDto, @ProjectId() projectId: string) {}

  @Get(':shortCode')
  @UseApiKey()
  getUrl(@Param('shortCode') shortCode: string) {}
}
