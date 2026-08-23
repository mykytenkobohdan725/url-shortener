import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from '../schemas/project.schema';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async findOne(id: string): Promise<Project | null> {
    return this.projectModel.findOne({ _id: id }).exec();
  }

  create(dto: CreateProjectDto): Promise<Project> {
    const project = new this.projectModel(dto);

    return project.save();
  }

  update(id: string, dto: UpdateProjectDto) {
    return this.projectModel
      .findByIdAndUpdate({ _id: id }, dto, { new: true })
      .exec();
  }

  delete(id: string) {
    return this.projectModel.findByIdAndDelete({ _id: id }).exec();
  }

  async getProjectIdByApiKey(
    apiKey: string | undefined,
  ): Promise<string | null> {
    if (!apiKey) {
      return null;
    }

    try {
      const cacheKey = `api-key:${apiKey}`;
      const cachedProjectId = await this.cacheManager.get<string>(cacheKey);

      if (cachedProjectId) {
        return cachedProjectId;
      }

      const project = await this.projectModel
        .findOne({
          apiKey,
          isActive: true,
        })
        .select({ _id: 1 })
        .exec();

      if (!project) {
        return null;
      }

      const projectId = project._id.toString();
      await this.cacheManager.set(cacheKey, projectId);
      return projectId;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
