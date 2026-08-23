import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../guards/api-key.guard';

export function UseApiKey() {
  return applyDecorators(UseGuards(ApiKeyGuard));
}
