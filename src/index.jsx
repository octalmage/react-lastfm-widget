import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Transition from 'react-transition-group/Transition';
import FetchLastfmTracks from './FetchLastfmTracks';

const buildStyles = (size, artwork) => ({
  container: {
    transition: 'opacity 800ms ease-in-out',
    opacity: 0,
    backgroundImage: `url("${artwork}")` || '',
    position: 'relative',
    backgroundSize: 'cover',
    fontSize: `${size.slice(0, -2) * 0.06}px`,
  },
  details: {
    lineHeight: '1.5em',
    textShadow: '0 0 10px rgba(0,0,0,.7)',
    position: 'absolute',
    bottom: '1.25em',
    left: '1.25em',
    right: '1.25em',
    margin: '0',
    color: '#fff',
    fontFamily: 'Arial, Helvetica, sans-serif',
    textDecoration: 'none',
    zIndex: '1',
  },
  title: {
    fontSize: '1.5em',
    lineHeight: '1.5em',
  },
});

const Gradient = styled.div`
  &:after {
    background-image: linear-gradient(180deg,transparent 0,rgba(0,0,0,.35) 70%,rgba(0,0,0,.7));
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
`;

const Link = styled.a`
  color: #fff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

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
      artwork: track.image[2]['#text'],
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
    const {
      username,
      onlyShowNowPlaying,
      size,
    } = this.props;
    const { track } = this.state;
    const styles = buildStyles(size, track.artwork);

    const inProp = onlyShowNowPlaying ? track.nowplaying : track.name !== '';

    return (
      <Transition in={inProp} timeout={800}>
        {state => (
          <div
            style={{
              height: size,
              width: size,
              ...styles.container,
              ...transitionStyles[state],
            }}
          >
            <div style={styles.details} id="track">
              <Link target="_blank" rel="noopener noreferrer" href={`http://www.last.fm/user/${username}/now`}>
                <span style={styles.title}>{track.name}</span><br />
                {track.artist}<br />
                {track.album}
              </Link>
            </div>
            <Gradient />
          </div>
          )}
      </Transition>
    );
  }
}

LastfmWidget.propTypes = {
  /** The Last.fm username. */
  username: PropTypes.string.isRequired,
  /** Your Last.fm apikey. */
  apikey: PropTypes.string.isRequired,
  /** Only display the widget if a song is currently playing. */
  onlyShowNowPlaying: PropTypes.bool,
  /** Overwrite default size. */
  size: PropTypes.string,
};

LastfmWidget.defaultProps = {
  onlyShowNowPlaying: false,
  size: '200px',
};

export default LastfmWidget;
