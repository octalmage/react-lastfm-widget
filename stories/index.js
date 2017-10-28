/* eslint import/no-extraneous-dependencies: 0 */
import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { withInfo, setDefaults } from '@storybook/addon-info';
import LastfmWidget from '../src/index';
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
      <LastfmWidget {...defaultProps} height="150px" width="150px" />
      <LastfmWidget {...defaultProps} height="250px" width="250px" />
      <LastfmWidget {...defaultProps} height="300px" width="300px" />
    </div>
  )));
