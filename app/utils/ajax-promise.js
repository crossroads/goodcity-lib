import { run } from '@ember/runloop';
import $ from 'jquery';
import { Promise as EmberPromise } from 'rsvp';
import config from '../config/environment';

export default function(url, type, authToken, data, args) {
  return new EmberPromise(function(resolve, reject) {
    var headers = {
      "X-GOODCITY-APP-NAME": config.APP.NAME,
      "X-GOODCITY-APP-VERSION": config.APP.VERSION,
      "X-GOODCITY-APP-SHA": config.APP.SHA
    };
    if(authToken) {
      headers = $.extend(headers, { Authorization: "Bearer " + authToken });
    }

    $.ajax($.extend({}, {
      type: type,
      dataType: "json",
      data: data,
      url: url.indexOf('http') === -1 ? config.APP.SERVER_PATH + url : url,
      headers: headers,
      success: function(data) { run(function() { resolve(data); }); },
      error: function(jqXHR) {
        jqXHR.url = url;
        run(function() { reject(jqXHR); });
      }
    }, args));
  });
}
