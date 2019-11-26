import $ from "jquery";
import { bind } from "@ember/runloop";
import Component from "@ember/component";
import Ember from "ember";

export default Component.extend(Ember.TargetActionSupport, {
  disabled: false,
  updateDisabled: null,

  didInsertElement: function() {
    this.updateDisabled = bind(this, () => {
      var online = navigator.connection
        ? navigator.connection.type !== "none"
        : navigator.onLine;
      this.set("disabled", !online);
    });
    this.updateDisabled();
    window.addEventListener("online", this.updateDisabled);
    window.addEventListener("offline", this.updateDisabled);
  },

  willDestroyElement: function() {
    if (this.updateDisabled) {
      window.removeEventListener("online", this.updateDisabled);
      window.removeEventListener("offline", this.updateDisabled);
    }
  },

  click() {
    if (this.get("disabled")) {
      return false;
    }

    if ($(".message-bar")[0].value === "") {
      $(".message-bar")
        .parent()
        .addClass("has-error");
      return false;
    } else {
      this.get("onClick")();
    }
  }
});
