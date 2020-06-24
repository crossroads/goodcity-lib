import Ember from "ember";

export default Ember.Helper.helper(function(value) {
  value = new Ember.Handlebars.SafeString(value[0] || "").string;
  value = value.replace(/(\r\n|\n|\r)/gm, "<br>");
  return new Ember.String.htmlSafe(value);
});
