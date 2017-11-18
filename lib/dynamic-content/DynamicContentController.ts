import {Get, JsonController, Param} from "routing-controllers";
import {DynamicContent} from "./models/DynamicContent";
import {NotFoundError} from "../common/NotFoundError";

@JsonController()
export class DynamicContentController {

  @Get('/dynamic-content/:key')
  async getDynamicContent(@Param('key') key: string) {
    const dynamicContent = await DynamicContent.findByPrimary<DynamicContent<any>>(key);

    if (dynamicContent) {
      return dynamicContent.toJSON();
    }
    throw new NotFoundError();
  }

}
