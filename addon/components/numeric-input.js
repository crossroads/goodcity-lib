import Ember from "ember";

export default Ember.TextField.extend({
  tagName: "input",
  type: "tel",
  attributeBindings: [
    "name",
    "type",
    "value",
    "maxlength",
    "id",
    "autoFocus",
    "placeholder",
    "required",
    "pattern",
    "acceptZeroValue",
    "acceptFloat"
  ],
  classNameBindings: ["class"],

  didInsertElement() {
    if (this.attrs.autoFocus) {
      this.$().focus();
    }
  },

  currentKey: Ember.computed({
    get: function() {
      return 0;
    },
    set: function(key, value) {
      return value;
    }
  }),

  focusOut() {
    let value = this.get("value");
    if (this.get("acceptFloat")) {
      value = parseFloat(value);
    } else {
      value = +value;
    }

    if ((value === 0 && !this.get("acceptZeroValue")) || isNaN(value)) {
      this.set("value", null);
    } else {
      this.set("value", value);
    }
  },

  isAllowed: Ember.computed("currentKey", function() {
    var key = this.get("currentKey");
    var allowed =
      key === 13 ||
      key === 8 ||
      key === 9 ||
      key === 46 ||
      key === 39 ||
      (key >= 35 && key <= 37) ||
      (this.get("acceptFloat") && key === 190);
    return allowed;
  }),

  keyUp: function() {
    var value = this.attrs.value.value;
    var regexPattern = new RegExp("^".concat(this.attrs.pattern, "$"));
    if (value && value.toString().search(regexPattern) !== 0) {
      this.set("value", value.replace(/\D/g, ""));
    }
    return true;
  },

  whichKey(e, key) {
    var keyList = [13, 8, 9, 39, 46];
    return (
      (e.ctrlKey && key === 86) ||
      keyList.indexOf(key) >= 0 ||
      (key >= 35 && key <= 37) ||
      (this.get("acceptFloat") && key === 190) ||
      (key >= 48 && key <= 57) ||
      (key >= 96 && key <= 105)
    );
  },

  keyDown: function(e) {
    var key = e.charCode || e.keyCode || 0;
    this.set("currentKey", key);

    // allow ctrl+v, enter, backspace, tab, delete, numbers, keypad numbers
    // home, end only.
    var keyPressed = this.whichKey(e, key);
    return keyPressed;
  },

  keyPress: function() {
    var inputValue = (this.value || "").toString();
    /* jshint ignore:start */
    return this.get("isAllowed")
      ? true
      : inputValue.length < this.attrs.maxlength;
    /* jshint ignore:end */
  }
});
