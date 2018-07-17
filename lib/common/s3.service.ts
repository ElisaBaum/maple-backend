import {S3} from 'aws-sdk';
import {Injectable} from 'injection-js';
import {config} from '../config';
import {createHmac, HexBase64Latin1Encoding} from "crypto";

const {aws} = config;

const SECRET = aws.config.secretAccessKey;
const ACCESS_KEY = aws.config.accessKeyId;
const URL = `https://s3.${aws.config.region}.amazonaws.com/`;
const REGION = aws.config.region;

const EXPIRE_IN = 10; // minutes
const ALGORITHM = 'AWS4-HMAC-SHA256';
const SERVICE = 's3';
const REQUEST_TYPE = 'aws4_request';
const SUCCESS_STATUS = '201';

interface IUploadPolicyOptions {
  acl: string;
  contentType: string;
  key: string;
}

@Injectable()
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

  deleteObject(key: string) {
    return new Promise((resolve, reject) => {
      this.s3.deleteObject({
        Bucket: config.aws.s3.bucket,
        Key: key,
      }, err => err ? reject(err) : resolve());
    });
  }

  getUploadPolicy({acl, contentType, key}: IUploadPolicyOptions) {
    const date = new Date();
    const bucket = aws.s3.bucket;
    const DELIMITER_REGEX = /[:|\.|-]/g;

    const awsDate = date.toJSON().replace(DELIMITER_REGEX, '');
    const expirationDate = new Date(date.getTime() + EXPIRE_IN * 60 * 1000).toJSON();
    const [shortDate] = awsDate.split('T'); // UTC to YYYYMMDD
    const expirationInSec = (EXPIRE_IN * 60).toString();

    const credential = this.getCredential(shortDate);

    const s3Policy = {
      expiration: expirationDate,
      conditions: [
        {bucket},
        {acl},
        ['starts-with', '$key', key],
        ['starts-with', '$Content-Type', contentType],
        {success_action_status: SUCCESS_STATUS},
        {'x-amz-credential': credential},
        {'x-amz-algorithm': ALGORITHM},
        {'x-amz-date': awsDate},
        {'x-amz-expires': expirationInSec},
        ['content-length-range', 0, aws.s3.maxBytes]
      ]
    };

    const base64Policy = new Buffer(JSON.stringify(s3Policy)).toString('base64');
    const signature = this.getSignature(shortDate, base64Policy);

    return {
      algorithm: ALGORITHM,
      credential,
      date: awsDate,
      expires: expirationInSec,
      url: URL + bucket,
      policy: base64Policy,
      acl,
      key,
      successStatus: SUCCESS_STATUS,
      signature
    };
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


  private getSignature(shortDate, stringToSign) {
    const date = this.hmacSHA256(shortDate, 'AWS4' + SECRET);
    const region = this.hmacSHA256(REGION, date);
    const service = this.hmacSHA256(SERVICE, region);
    const signing = this.hmacSHA256(REQUEST_TYPE, service);

    return this.hmacSHA256(stringToSign, signing, 'hex');
  }

  private getCredential(shortDate) {
    return [
      ACCESS_KEY,
      shortDate,
      REGION,
      SERVICE,
      REQUEST_TYPE
    ].join('/');
  }

  private hmacSHA256(value: string, secret: string | Buffer, encoding?: HexBase64Latin1Encoding) {
    const hmac = createHmac('sha256', secret)
      .update(value);

    if (encoding) {
      return hmac.digest(encoding);
    }
    return hmac.digest();
  }


}
