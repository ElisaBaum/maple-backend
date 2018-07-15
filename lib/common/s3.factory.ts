import {S3} from 'aws-sdk';
import {config} from '../config';

export const s3Factory = () => new S3({...config.aws.config});
