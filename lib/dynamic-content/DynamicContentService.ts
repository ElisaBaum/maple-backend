import {Inject} from 'di-typescript';
import {DynamicContent} from './models/DynamicContent';
import {S3Service} from '../common/S3Service';
import {config} from '../config';

@Inject
export class DynamicContentService {

  constructor(private s3Service: S3Service) {
  }

  async getDynamicContent(key: string) {
    const dynamicContent = await DynamicContent.findByPrimary(key);
    if (dynamicContent && dynamicContent.resources) {
      await this.prepareDynamicContent(dynamicContent);
    }
    return dynamicContent;
  }

  private async prepareDynamicContent(dynamicContent: DynamicContent<any>) {
    return Promise.all(Object
      .keys(dynamicContent.resources)
      .map(async key => {
        const resources = dynamicContent.resources[key];
        const urls = Array.isArray(resources)
          ? await this.getSignedUrls(resources)
          : await this.getSignedUrl(resources);
        this.replaceWithSignedUrls(key, urls, dynamicContent.content);
      }));
  }

  private replaceWithSignedUrls(targetKey, urls, content) {
    Object.keys(content).forEach(key => {
      const value = content[key];
      if (value && typeof value === 'object') {
        this.replaceWithSignedUrls(targetKey, urls, value);
      } else if (content[key] === targetKey) {
        content[key] = urls;
      }
    });
  }

  private async getSignedUrls(resources: string[]) {
    return Promise.all(resources.map(resource => this.getSignedUrl(resource)));
  }

  private async getSignedUrl(resource: string) {
    return this.s3Service.getSignedUrl('getObject', {
      Bucket: config.aws.s3.bucket,
      Key: resource,
      Expires: config.aws.s3.signedUrlExpirationTime,
    });
  }
}
