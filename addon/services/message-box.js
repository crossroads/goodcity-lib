import Ember from "ember";
const { getOwner } = Ember;

export default Ember.Service.extend({
  intl: Ember.inject.service(),

  alert: function(message, callback) {
    this.custom(message, this.get("intl").t("okay"), callback);
  },

  confirm: function(message, callback) {
    this.custom(
      message,
      this.get("intl").t("cancel"),
      null,
      this.get("intl").t("okay"),
      callback
    );
  },

  custom: function(
    message,
    btn1Text,
    btn1Callback,
    btn2Text,
    btn2Callback,
    displayCloseLink
  ) {
    Ember.$(document).trigger("cancel-loading-timer");
    Ember.$(".loading-indicator").remove();

    var view = getOwner(this)
      .lookup("component:message-box")
      .append();
    view.set("btn1Text", btn1Text);
    view.set("btn1Callback", btn1Callback);
    view.set("btn2Text", btn2Text);
    view.set("btn2Callback", btn2Callback);
    view.set("message", message);
    view.set("displayCloseLink", displayCloseLink);
    view.set("isVisible", true);
  }
});
