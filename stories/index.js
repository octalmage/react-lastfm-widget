import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo, setDefaults } from '@storybook/addon-info';
import LastfmWidget from '../src/index.bs';
import './index.css';

setDefaults({
  inline: true,
  header: false,
});

const defaultProps = {
  username: 'comic_coder',
  apikey: '1f633977acf0e2d0630ec11dbc350d3e',
};

storiesOf('LastfmWidget', module)
  .add('Last Last.fm Track', withInfo()(() =>
    <LastfmWidget {...defaultProps} />))
  .add('Now Playing', withInfo('This will only show the widget if the track is currently playing.')(() =>
    <LastfmWidget {...defaultProps} onlyShowNowPlaying />))
  .add('Different Widget Sizes', withInfo()(() => (
    <div className="sizes">
      <LastfmWidget {...defaultProps} size="100px" />
      <LastfmWidget {...defaultProps} size="150px" />
      <LastfmWidget {...defaultProps} size="250px" />
      <LastfmWidget {...defaultProps} size="300px" />
    </div>
  )));
