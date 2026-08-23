import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlModule } from './url/url.module';
import { ProjectsModule } from './projects/projects.module';
import dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI ?? ''), UrlModule, ProjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
