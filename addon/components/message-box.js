import Ember from 'ember';

export default Ember.Component.extend({

  layoutName: 'components/message-box',
  message: "",
  btn1Text: "",
  btn1Callback: () => {},
  btn2Text: "",
  btn2Callback: () => {},
  displayCloseLink: false,

  isVisible: false,

  close() {
    if (this.get("isVisible")) {
      this.set("isVisible", false);
    } else {
      this.destroy();
    }
  },

  actions: {
    btn1Click() {
      var callbackOutput = true;
      if (this.btn1Callback) {
        callbackOutput = this.btn1Callback();
      }
      if(callbackOutput !== false) { this.close(); }
    },

    btn2Click() {
      if (this.btn2Callback) {
        this.btn2Callback();
      }
      this.close();
    },

    closeModal() {
      this.close();
    }
  }
});
