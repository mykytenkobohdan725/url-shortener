import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { getModelToken } from '@nestjs/mongoose';
import { Url } from '../schemas/url.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateUrlDto } from './dto/create-url.dto';

jest.mock('nanoid', () => ({
  customAlphabet: () => () => 'mockedShortCode123',
}));

describe('UrlService', () => {
  let service: UrlService;
  let mockUrlModel: any;

  const mockCacheManager = {
    get: jest.fn().mockResolvedValue('cached_value'),
    set: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    };

    mockUrlModel = {
      create: jest.fn(),
      findOne: jest.fn().mockReturnValue(mockQuery),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getModelToken(Url.name),
          useValue: mockUrlModel,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a short URL successfully', async () => {
    const dto = {
      originalUrl: 'https://google.com',
    };
    const projectId = '507f1f77bcf86cd799439011';

    mockUrlModel.create.mockResolvedValue({
      originalUrl: dto.originalUrl,
      shortCode: 'a8Xk9P',
      project: projectId,
    });

    const result = await service.createUrl(dto as CreateUrlDto, projectId);

    expect(result.shortCode).toBeDefined();
    expect(mockUrlModel.create).toHaveBeenCalled();
  });

  it('should get a original url', async () => {
    const mockShortCode = 'a8Xk9P';
    const mockOriginalUrl = 'https://google.com';
    const projectId = '507f1f77bcf86cd799439011';

    mockCacheManager.get.mockResolvedValue(mockOriginalUrl);

    const result = await service.getOriginalUrl(mockShortCode, projectId);

    expect(result).toBe(mockOriginalUrl);
    expect(mockCacheManager.get).toHaveBeenCalledWith(`url:${projectId}:${mockShortCode}`);
    expect(mockUrlModel.findOne).not.toHaveBeenCalled();
  });
});
