import {S3} from 'aws-sdk';
import {Inject} from 'di-typescript';

@Inject
export class S3Service {

  constructor(private s3: S3) {
  }

  getSignedUrl(operation, params: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl(operation, params, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }

}
