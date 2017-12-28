import {Get, JsonController, Param} from "routing-controllers";
import {NotFoundError} from "../common/errors/NotFoundError";
import {DynamicContentService} from './DynamicContentService';
import {Inject} from 'di-typescript';

@Inject
@JsonController()
export class DynamicContentController {

  constructor(private dynamicContentService: DynamicContentService) {

  }

  @Get('/dynamic-content/:key')
  async getDynamicContent(@Param('key') key: string) {
    const dynamicContent = await this.dynamicContentService.getDynamicContent(key);

    if (dynamicContent) {
      return dynamicContent.toJSON();
    }
    throw new NotFoundError();
  }

}
