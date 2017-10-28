import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import FetchLastfmTracks from './FetchLastfmTracks';


// jQuery.get( "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=comic_coder&api_key=1f633977acf0e2d0630ec11dbc350d3e&format=json", function( data ) {
//   if (typeof data.recenttracks.track[0]["@attr"] != "undefined")
//   {
//     artist=data.recenttracks.track[0].artist["#text"];
//     track=data.recenttracks.track[0].name;
//     album=data.recenttracks.track[0].album["#text"];
//     artwork=data.recenttracks.track[0].image[1]["#text"];
//     jQuery("#artwork").attr("src", artwork);
//     jQuery("#track").html(track + "<br>" + artist + "<br><br>" + album);
//     jQuery("#last").fadeIn("slow");
const styles = {
  container: {
    width: '200px',
    transition: 'opacity 800ms ease-in-out',
    opacity: 0,
  },
  img: {
    paddingRight: '5px',
    borderRadius: '0',
  },
  p: {
    float: 'left',
  },
  track: {
    fontSize: '12px',
    lineHeight: '15px',
    margin: '0px',
    fontFamily: 'Times New Roman", Georgia, Serif',
  },
};

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};


class LastfmWidget extends React.Component {
  static formatTrack(track) {
    return {
      artist: track.artist['#text'],
      name: track.name,
      album: track.album['#text'],
      artwork: track.image[1]['#text'],
      nowplaying: typeof track['@attr'] !== 'undefined' && typeof track['@attr'].nowplaying !== 'undefined',
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      track: {
        artwork: '',
        artist: '',
        name: '',
        album: '',
        nowplaying: false,
      },
    };
  }

  componentDidMount() {
    const { username, apikey } = this.props;
    return FetchLastfmTracks(username, apikey)
      .then((response) => {
        this.setState({ track: LastfmWidget.formatTrack(response.recenttracks.track[0]) });
        return response.recenttracks.track[0];
      })
      .catch((error) => {
        console.error(error); // eslint-disable-line no-console
      });
  }

  render() {
    const { username, onlyShowNowPlaying } = this.props;
    const { track } = this.state;

    if (onlyShowNowPlaying && !track.nowplaying) {
      return null;
    }

    return (
      <Transition in={track.name !== ''} timeout={800}>
        {state => (
          <div style={{
          ...styles.container,
          ...transitionStyles[state],
        }}
          >
            <div style={styles.p}>
              <a target="_blank" rel="noopener noreferrer" href={`http://www.last.fm/user/${username}/now`}>
                <img style={styles.img} id="artwork" src={track.artwork} alt="" />
              </a>
            </div>
            <div style={styles.track} id="track">
              <strong>{track.name}</strong><br />
              {track.artist}<br />
              {track.album}
            </div>
          </div>
          )}
      </Transition>
    );
  }
}

LastfmWidget.propTypes = {
  username: PropTypes.string.isRequired,
  apikey: PropTypes.string.isRequired,
  onlyShowNowPlaying: PropTypes.bool,
};

LastfmWidget.defaultProps = {
  onlyShowNowPlaying: false,
};

export default LastfmWidget;
