import * as rules from "@vee-validate/rules";
import { boot } from "quasar/wrappers";
import { defineRule } from "vee-validate";

export default boot(({ app }) => {
  Object.keys(rules).forEach((rule) => {
    if (rule !== "default") {
      defineRule(rule, rules[rule]);
    }
  });
});
