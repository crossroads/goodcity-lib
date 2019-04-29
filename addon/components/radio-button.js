import Ember from "ember";

export default Ember.Component.extend({
  tagName: "input",
  type: "radio",
  attributeBindings: [
    "name",
    "type",
    "value",
    "checked",
    "labelText",
    "disabled"
  ],
  disabled: false,

  click() {
    this.set("selection", this.get("value"));
  },

  checked: Ember.computed("selection", function() {
    return this.get("value") === this.get("selection");
  }),

  onInit: Ember.on("init", function() {
    if (this.get("value") === this.get("selection")) {
      this.set("checked", true);
    }
  })
});
