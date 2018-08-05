import {Lambda} from 'aws-sdk';
import {Injectable} from 'injection-js';
import {config} from '../config';

const {aws} = config;

const lambda = new Lambda({region: aws.config.region});

@Injectable()
export class LambdaService {

  // todo robin: think about timeout?
  invoke(name: string, payload: any) {
    return lambda.invoke({FunctionName: name, Payload: JSON.stringify(payload)}).promise();
  }

}
