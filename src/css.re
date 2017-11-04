open Glamor;

/* Calculate initial font size. */
let calculateFontSize = (size) =>
  size
  |> ((s) => String.sub(s, 0, String.length(s) - 2))
  |> float_of_string
  |> ((float) => float *. 0.06)
  |> string_of_float
  |> ((s) => String.sub(s, 0, String.length(s) - 1));

module Css = {
  let createContainer = (url, size) =>
    css([
      transition("opacity 800ms ease-in-out"),
      backgroundImage("url(" ++ url ++ ")"),
      position("relative"),
      backgroundSize("cover"),
      fontSize(size |> calculateFontSize)
    ]);
  let createSize = (size) => css([height(size), width(size)]);
  let hide = css([opacity("0")]);
  let show = css([opacity("1")]);
  let title = css([fontSize("1.5em"), lineHeight("1.5em")]);
  let details =
    css([
      lineHeight("1.5em"),
      textShadow("0 0 10px rgba(0,0,0,.7)"),
      position("absolute"),
      bottom("1.25em"),
      left("1.25em"),
      right("1.25em"),
      margin("0"),
      color("#fff"),
      fontFamily("Arial, Helvetica, sans-serif"),
      textDecoration("none"),
      zIndex("1")
    ]);
  let link =
    css([
      color("#fff"),
      textDecoration("none"),
      Selector("&:hover", [textDecoration("underline")])
    ]);
  let gradient =
    css([
      Selector(
        "&:after",
        [
          backgroundImage(
            "linear-gradient(180deg,transparent 0,rgba(0,0,0,.35) 70%,rgba(0,0,0,.7))"
          ),
          content("\"\""),
          position("absolute"),
          width("100%"),
          height("100%"),
          top("0"),
          left("0")
        ]
      )
    ]);
};
