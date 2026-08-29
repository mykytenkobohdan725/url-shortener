import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.get('x-api-key');

    if (!apiKey) {
      console.log(
        `Auth failed: Missing x-api-key header from IP: ${request.ip}`,
      );
      throw new UnauthorizedException('Unauthorized');
    }

    const projectId = await this.projectsService.getProjectIdByApiKey(apiKey);

    if (!projectId) {
      console.log(
        `Auth failed: Invalid API key "${apiKey}" from IP: ${request.ip}`,
      );
      throw new UnauthorizedException('Unauthorized');
    }

    request.projectId = projectId;
    return true;
  }
}
