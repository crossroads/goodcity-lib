import Ember from 'ember';

export default Ember.Component.extend({
  btn1Click: false,
  btn2Click: false,
  toggleEnter: true,

  keyUp: function (e) {
    var pressEnter = this.toggleProperty('toggleEnter');
    var messageBox = Ember.$('#messageBox')[0];

    if(e.which === 13 && messageBox && pressEnter) {
      if(this.get('btn1Click')) {
        this.clickBtn1();
      } else if (this.get('btn2Click')) {
        //btn2 related code
      } else {
        this.clickBtn1();
      }
    }
  },

  clickBtn1() {
    Ember.$('#messageBox #btn1').each(message => {
      console.log(message);
      var messageText = Ember.$('#messageBox p#messageBoxText').text().trim().toLowerCase();
      var btn1Text = Ember.$('#messageBox #btn1').text().toLowerCase();
      if(((btn1Text.indexOf('okay') >= 0) || (btn1Text.indexOf('ok') >= 0)) && (messageText.indexOf('invalid sms code') >= 0)) {
        Ember.run.later(() => {
          Ember.$('#messageBox #btn1').click();
        }, 250);
      }
    });
  }
});

