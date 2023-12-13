import { boot } from "quasar/wrappers";
import { Field, Form } from "vee-validate";

export default boot(({ app }) => {
  app.component("vv-field", Field);
  app.component("vv-form", Form);
});
