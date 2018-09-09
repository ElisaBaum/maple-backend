import {Injectable} from 'injection-js';
import {DynamicContent} from './models/dynamic-content.model';
import {S3Service} from '../common/s3.service';

@Injectable()
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
        const resource = dynamicContent.resources[key];
        const urls = await this.getSignedUrls(resource);
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

  private async getSignedUrls(resource: string) {
    const WILDCARD_REGEX = /\/\*/;
    if (WILDCARD_REGEX.test(resource)) {
      const prefix = resource.replace(WILDCARD_REGEX, '');
      const keys = await this.s3Service.listObjects(prefix);

      return Promise.all(keys
        .map(async (key) => this.s3Service.getSignedUrl(key)));
    }
    return this.s3Service.getSignedUrl(resource);
  }

}
