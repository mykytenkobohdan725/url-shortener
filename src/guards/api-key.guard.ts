import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.get('x-api-key');
    const projectId = await this.projectsService.getProjectIdByApiKey(apiKey);

    if (!projectId) {
      return false;
    }

    request.projectId = projectId;
    return true;
  }
}
