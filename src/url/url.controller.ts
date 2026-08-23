import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { UrlService } from './url.service';
import { UseApiKey } from '../decorators/api-key.decorator';
import { CreateUrlDto } from './dto/create-url.dto';
import { ProjectId } from '../decorators/project-id.decorator';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @UseApiKey()
  createUrl(@Body() dto: CreateUrlDto, @ProjectId() projectId: string) {
    return this.urlService.createUrl(dto, projectId);
  }

  @Get(':shortCode')
  @UseApiKey()
  @Redirect()
  async getUrl(@Param('shortCode') shortCode: string) {
    const url = await this.urlService.getOriginalUrl(shortCode);

    return { url };
  }
}
