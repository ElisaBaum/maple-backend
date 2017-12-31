import {injector} from "./injector";
import {App} from "./App";

const app = injector.get(App).getExpressApp();

app.listen(process.env.PORT || 3000, () => {
  // tslint:disable:no-console
  console.log('Server listening on port 3000!');
});
