import {Provider} from 'injection-js';
import {DynamicContentController} from './dynamic-content.controller';
import {DynamicContentService} from './dynamic-content.service';

export const DYNAMIC_CONTENT_PROVIDERS: Provider[] = [
  DynamicContentController,
  DynamicContentService,
];
