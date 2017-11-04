open Css;

type track = {
  .
  "artist": string,
  "name": string,
  "album": string,
  "artwork": array(string),
  "nowplaying": option(string)
};

let decodeTracks = (json) =>
  Json.Decode.(
    {
      "name": json |> field("name", string),
      "artist": json |> field("artist", field("#text", string)),
      "album": json |> field("album", field("#text", string)),
      "artwork": json |> field("image", array(field("#text", string))),
      "nowplaying":
        json |> optional(field("@attr", field("nowplaying", string)))
    }
  );

let parseResponseJson = (json) =>
  Json.Decode.field(
    "recenttracks",
    Json.Decode.field("track", Json.Decode.array(decodeTracks)),
    json
  );

type action =
  | UpdateTrack(track);

type state = {track};

let component = ReasonReact.reducerComponent("LastfmWidget");

let make =
    (
      ~username: string,
      ~apikey: string,
      ~onlyShowNowPlaying: option(bool)=?,
      ~size="200px",
      _children
    ) => {
  ...component,
  initialState: () => {
    track: {
      "artist": "",
      "name": "",
      "album": "",
      "artwork": [||],
      "nowplaying": Some("false")
    }
  },
  didMount: (self) => {
    let _ =
      Js.Promise.(
        Fetch.fetch(
          {j|https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=$username&api_key=$apikey&format=json|j}
        )
        |> then_(Fetch.Response.text)
        |> then_(
             (response) =>
               resolve(parseResponseJson(Js.Json.parseExn(response)))
           )
        |> then_(
             (tracks) => {
               self.reduce((_) => UpdateTrack(tracks[0]), ());
               resolve()
             }
           )
      );
    ReasonReact.NoUpdate
  },
  reducer: (action, _state) =>
    switch action {
    | UpdateTrack(track) => ReasonReact.Update({track: track})
    },
  render: (self) => {
    let imageList = Array.to_list(self.state.track##artwork);
    let image =
      switch imageList {
      | [] => ""
      | [_, _, c, ..._] => c
      | _ => ""
      };
    let showProp =
      switch (onlyShowNowPlaying, self.state.track##name) {
      | (Some(true), _) => self.state.track##nowplaying
      | (Some(false), "")
      | (None, "") => Some("false")
      | (Some(false), _)
      | (None, _) => Some("true")
      };
    let showOrHide = showProp == Some("true") ? Css.show : Css.hide;
    <div
      className=(
        Css.createContainer(image, size)
        ++ " "
        ++ showOrHide
        ++ " "
        ++ Css.createSize(size)
      )>
      <div className=Css.details>
        <a
          className=Css.link
          target="_blank"
          rel="noopener noreferrer"
          href=("http://www.last.fm/user/" ++ username ++ "/now")>
          <span className=Css.title>
            (ReasonReact.stringToElement(self.state.track##name))
          </span>
          <br />
          (ReasonReact.stringToElement(self.state.track##album))
          <br />
          (ReasonReact.stringToElement(self.state.track##artist))
        </a>
      </div>
      <div className=Css.gradient />
    </div>
  }
};

let default =
  ReasonReact.wrapReasonForJs(
    ~component,
    (jsProps) =>
      make(
        ~username=jsProps##username,
        ~apikey=jsProps##apikey,
        ~onlyShowNowPlaying=?Js.Nullable.to_opt(jsProps##onlyShowNowPlaying),
        ~size=?Js.Nullable.to_opt(jsProps##size),
        [||]
      )
  );

[%%bs.raw
  {|
// Fake PropTypes for Stroybook, I wish I didn't have to do this.
let PropTypes = require('prop-types');
$$default.propTypes = {
  /** The Last.fm username. */
  username: PropTypes.string.isRequired,
  /** Your Last.fm apikey. */
  apikey: PropTypes.string.isRequired,
  /** Only display the widget if a song is currently playing. */
  onlyShowNowPlaying: PropTypes.bool,
  /** Overwrite default size. */
  size: PropTypes.string,
};
|}
];
