import {S3} from 'aws-sdk';
import {Inject} from 'di-typescript';
import {config} from '../config';

@Inject
export class S3Service {

  constructor(private s3: S3) {
  }

  getSignedUrl(key: string): Promise<string> {
    return new Promise((resolve, reject) =>
      this.s3.getSignedUrl('getObject', {
        Bucket: config.aws.s3.bucket,
        Key: key,
        Expires: config.aws.s3.signedUrlExpirationTime,
      }, (err, url) =>
        err ? reject(err) : resolve(url))
    );
  }

  async listObjects(prefix?: string): Promise<string[]> {
    const result = await this.s3.listObjects({
      Bucket: config.aws.s3.bucket,
      Prefix: prefix,
    }).promise();
    if (!result.Contents) {
      throw new Error(`Resource Error: Could not find any resources in ${prefix}`);
    }
    const keys = result.Contents.map(({Key}) => Key as string);
    // Remove the first key, because this is the bucket folder
    keys.shift();
    return keys;
  }

}
