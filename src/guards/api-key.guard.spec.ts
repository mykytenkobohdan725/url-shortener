import { ApiKeyGuard } from './api-key.guard';
import { ProjectsService } from '../projects/projects.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let projectsService: jest.Mocked<ProjectsService>;

  beforeEach(async () => {
    const mockProjectsService = {
      getProjectIdByApiKey: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    guard = module.get<ApiKeyGuard>(ApiKeyGuard);
    projectsService = module.get(ProjectsService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow request and set projectId when API key is valid', async () => {
    const mockProjectId = '507f1f77bcf86cd799439011';

    projectsService.getProjectIdByApiKey.mockResolvedValue(mockProjectId);

    const mockRequest: any = {
      headers: { 'x-api-key': 'valid-key' },
      get(key: string): string {
        return this.headers[key.toLowerCase()] as string;
      },
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.projectId).toBe(mockProjectId);
    expect(projectsService.getProjectIdByApiKey).toHaveBeenCalledWith(
      'valid-key',
    );
  });

  it('should reject request when API key is missing or invalid', async () => {
    const mockRequest: any = {
      headers: {},
      get(key: string): string {
        return this.headers[key.toLowerCase()] as string;
      },
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(false);
  });
});
