import { run } from "@ember/runloop";
import $ from "jquery";
import { Promise } from "rsvp";
import config from "../config/environment";

let defaultHeaders = {
  "X-GOODCITY-APP-NAME": config.APP.NAME,
  "X-GOODCITY-APP-VERSION": config.APP.VERSION,
  "X-GOODCITY-APP-SHA": config.APP.SHA
};

function _read(data) {
  if (typeof data == "function") {
    return data();
  }
  return data;
}

function AjaxPromise(url, type, authToken, data, args, language = "en") {
  return new Promise(function(resolve, reject) {
    var headers = $.extend({}, _read(defaultHeaders), {
      "Accept-Language": language
    });

    if (authToken) {
      headers["Authorization"] = "Bearer " + authToken;
    }

    $.ajax(
      $.extend(
        {},
        {
          type: type,
          dataType: "json",
          data: data,
          language: language,
          url: url.indexOf("http") === -1 ? config.APP.SERVER_PATH + url : url,
          headers: headers,
          success: function(data) {
            run(function() {
              resolve(data);
            });
          },
          error: function(jqXHR) {
            jqXHR.url = url;
            run(function() {
              reject(jqXHR);
            });
          }
        },
        args
      )
    );
  });
}

AjaxPromise.setDefaultHeaders = function(headers) {
  defaultHeaders = headers;
};

export default AjaxPromise;
