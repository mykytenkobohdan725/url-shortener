import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from '../schemas/project.schema';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
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

  isValidProject() {}
}
