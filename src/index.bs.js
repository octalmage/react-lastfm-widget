// Generated by BUCKLESCRIPT VERSION 2.0.0, PLEASE EDIT WITH CARE
'use strict';

var $$Array           = require("bs-platform/lib/js/array.js");
var Block             = require("bs-platform/lib/js/block.js");
var Curry             = require("bs-platform/lib/js/curry.js");
var React             = require("react");
var Caml_obj          = require("bs-platform/lib/js/caml_obj.js");
var Caml_array        = require("bs-platform/lib/js/caml_array.js");
var Json_decode       = require("bs-json/src/Json_decode.js");
var ReasonReact       = require("reason-react/src/reasonReact.js");
var Js_primitive      = require("bs-platform/lib/js/js_primitive.js");
var Css$ReactTemplate = require("./css.bs.js");

function decodeTracks(json) {
  return {
          name: Json_decode.field("name", Json_decode.string, json),
          artist: Json_decode.field("artist", (function (param) {
                  return Json_decode.field("#text", Json_decode.string, param);
                }), json),
          album: Json_decode.field("album", (function (param) {
                  return Json_decode.field("#text", Json_decode.string, param);
                }), json),
          artwork: Json_decode.field("image", (function (param) {
                  return Json_decode.array((function (param) {
                                return Json_decode.field("#text", Json_decode.string, param);
                              }), param);
                }), json),
          nowplaying: Json_decode.optional((function (param) {
                  return Json_decode.field("@attr", (function (param) {
                                return Json_decode.field("nowplaying", Json_decode.string, param);
                              }), param);
                }), json)
        };
}

function parseResponseJson(json) {
  return Json_decode.field("recenttracks", (function (param) {
                return Json_decode.field("track", (function (param) {
                              return Json_decode.array(decodeTracks, param);
                            }), param);
              }), json);
}

var component = ReasonReact.reducerComponent("LastfmWidget");

function make(username, apikey, onlyShowNowPlaying, $staropt$star, _) {
  var size = $staropt$star ? $staropt$star[0] : "200px";
  var newrecord = component.slice();
  newrecord[/* didMount */4] = (function (self) {
      fetch("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=" + (String(username) + ("&api_key=" + (String(apikey) + "&format=json")))).then((function (prim) {
                  return prim.text();
                })).then((function (response) {
                return Promise.resolve(parseResponseJson(JSON.parse(response)));
              })).then((function (tracks) {
              Curry._2(self[/* reduce */3], (function () {
                      return /* UpdateTrack */[Caml_array.caml_array_get(tracks, 0)];
                    }), /* () */0);
              return Promise.resolve(/* () */0);
            }));
      return /* NoUpdate */0;
    });
  newrecord[/* render */9] = (function (self) {
      var imageList = $$Array.to_list(self[/* state */4][/* track */0].artwork);
      var image;
      if (imageList) {
        var match = imageList[1];
        if (match) {
          var match$1 = match[1];
          image = match$1 ? match$1[0] : "";
        } else {
          image = "";
        }
      } else {
        image = "";
      }
      var match$2 = self[/* state */4][/* track */0].name;
      var showProp = onlyShowNowPlaying ? (
          onlyShowNowPlaying[0] !== 0 ? self[/* state */4][/* track */0].nowplaying : (
              match$2 === "" ? /* Some */["false"] : /* Some */["true"]
            )
        ) : (
          match$2 === "" ? /* Some */["false"] : /* Some */["true"]
        );
      var match$3 = Caml_obj.caml_equal(showProp, /* Some */["true"]);
      var showOrHide = match$3 !== 0 ? Css$ReactTemplate.Css[/* show */3] : Css$ReactTemplate.Css[/* hide */2];
      return React.createElement("div", {
                  className: Css$ReactTemplate.Css[/* createContainer */0](image, size) + " " + showOrHide + " " + Css$ReactTemplate.Css[/* createSize */1](size)
                }, React.createElement("div", {
                      className: Css$ReactTemplate.Css[/* details */5]
                    }, React.createElement("a", {
                          className: Css$ReactTemplate.Css[/* link */6],
                          href: "http://www.last.fm/user/" + username + "/now",
                          rel: "noopener noreferrer",
                          target: "_blank"
                        }, React.createElement("span", {
                              className: Css$ReactTemplate.Css[/* title */4]
                            }, self[/* state */4][/* track */0].name), React.createElement("br", undefined), self[/* state */4][/* track */0].album, React.createElement("br", undefined), self[/* state */4][/* track */0].artist)), React.createElement("div", {
                      className: Css$ReactTemplate.Css[/* gradient */7]
                    }));
    });
  newrecord[/* initialState */10] = (function () {
      return /* record */[/* track */{
                artist: "",
                name: "",
                album: "",
                artwork: /* array */[],
                nowplaying: /* Some */["false"]
              }];
    });
  newrecord[/* reducer */12] = (function (action, _) {
      return /* Update */Block.__(0, [/* record */[/* track */action[0]]]);
    });
  return newrecord;
}

var lastfmWidget = ReasonReact.wrapReasonForJs(component, (function (jsProps) {
        return make(jsProps.username, jsProps.apikey, Js_primitive.null_undefined_to_opt(jsProps.onlyShowNowPlaying), Js_primitive.null_undefined_to_opt(jsProps.size), /* array */[]);
      }));


let PropTypes = require('prop-types');
lastfmWidget.propTypes = {
  /** The Last.fm username. */
  username: PropTypes.string.isRequired,
  /** Your Last.fm apikey. */
  apikey: PropTypes.string.isRequired,
  /** Only display the widget if a song is currently playing. */
  onlyShowNowPlaying: PropTypes.bool,
  /** Overwrite default size. */
  size: PropTypes.string,
};
export default lastfmWidget;

;

exports.decodeTracks      = decodeTracks;
exports.parseResponseJson = parseResponseJson;
exports.component         = component;
exports.make              = make;
exports.lastfmWidget      = lastfmWidget;
/* component Not a pure module */
