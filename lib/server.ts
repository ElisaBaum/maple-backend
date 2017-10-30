import {injector} from "./injector";
import {App} from "./App";

const app = injector.get(App).expressApp;

app.listen(process.env.PORT || 3000, () => {
  console.log('Example app listening on port 3000!');
});