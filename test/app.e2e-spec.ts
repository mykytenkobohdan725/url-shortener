import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('UrlShortener (e2e)', () => {
  let app: INestApplication<App>;
  let testProjectId: string;
  let testProjectApiKey: string;
  let createdShortCode: string;

  let projectModel: Model<any>;
  let urlModel: Model<any>;

  const targetUrl = 'https://google.com';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    projectModel = moduleFixture.get(getModelToken('Project'));
    urlModel = moduleFixture.get(getModelToken('Url'));

    const testProject = await projectModel.create({
      name: 'E2E Test Project',
      apiKey: 'e2e-api-key',
    });

    testProjectId = testProject._id.toString();
    testProjectApiKey = testProject.apiKey;
  });

  afterAll(async () => {
    if (testProjectId) {
      await urlModel.deleteMany({ project: testProjectId });
      await projectModel.deleteOne({ _id: testProjectId });
    }

    await app.close();
  });

  it('/url (POST) - should create a short URL', () => {
    return request(app.getHttpServer())
      .post('/url')
      .set('x-api-key', testProjectApiKey)
      .send({ originalUrl: targetUrl })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('shortCode');
        createdShortCode = res.body.shortCode;
      });
  });

  it('/url (POST) - should return 401 for invalid API key', () => {
    return request(app.getHttpServer())
      .post('/url')
      .set('x-api-key', 'invalid-api-key')
      .send({ originalUrl: targetUrl })
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toBe('Unauthorized');
      });
  });

  it('/url (POST) - should return 401 if API key is missing', () => {
    return request(app.getHttpServer())
      .post('/url')
      .send({ originalUrl: targetUrl })
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toBe('Unauthorized');
      });
  });

  it('/url (POST) - should return 400 for invalid URL format', () => {
    return request(app.getHttpServer())
      .post('/url')
      .set('x-api-key', testProjectApiKey)
      .send({ originalUrl: 'not-a-valid-url' })
      .expect(400);
  });

  it('url/:code (GET) - should redirect to original URL', () => {
    return request(app.getHttpServer())
      .get(`/url/${createdShortCode}`)
      .set('x-api-key', testProjectApiKey)
      .expect(302)
      .expect('Location', targetUrl);
  });
});
