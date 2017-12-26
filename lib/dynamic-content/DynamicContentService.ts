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
      await this.setSignedUrlsToDynamicContent(dynamicContent);
    }
    return dynamicContent;
  }

  private async setSignedUrlsToDynamicContent(dynamicContent: DynamicContent<any>) {
    const setUrls = (targetKey, urls, content) => {
      Object.keys(content).forEach(key => {
        const value = content[key];
        if (value && typeof value === 'object') {
          setUrls(targetKey, urls, value);
        } else if (content[key] === targetKey) {
          content[key] = urls;
        }
      });
    };
    return await Promise.all(Object
      .keys(dynamicContent.resources)
      .map(async key => {
        const resources = dynamicContent.resources[key];
        let urls;
        if (Array.isArray(resources)) {
          urls = await this.getSignedUrls(resources);
        } else {
          urls = await this.getSignedUrl(resources);
        }
        setUrls(key, urls, dynamicContent.content);
      }));
  }

  private async getSignedUrls(resources: string[]) {
    return await Promise.all(resources.map(resource => this.getSignedUrl(resource)));
  }

  private async getSignedUrl(resource: string) {
    return await this.s3Service.getSignedUrl('getObject', {
      Bucket: config.aws.s3.bucket,
      Key: resource,
      Expires: config.aws.s3.signedUrlExpirationTime,
    });
  }
}
