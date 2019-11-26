import { htmlSafe } from "@ember/template";
import { helper as buildHelper } from "@ember/component/helper";
import Ember from "ember";

export default buildHelper(function(value) {
  value = Ember.Handlebars.Utils.escapeExpression(value || "");
  value = value.replace(/(\r\n|\n|\r)/gm, "<br>");
  return new htmlSafe(value);
});
