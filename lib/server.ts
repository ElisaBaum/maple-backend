import {injector} from "./injector";
import {App} from "./app";

const app = injector.get(App).getExpressApp();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  // tslint:disable:no-console
  console.log(`Server listening on port ${port}!`);
});
