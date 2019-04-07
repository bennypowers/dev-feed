import { storiesOf, html, withKnobs, withClassPropertiesKnobs, text, select } from '@open-wc/demoing-storybook';

import DevFeed from '../src/DevFeed.js';
import '../src/dev-feed.js';

import readme from '../README.md';

storiesOf('dev-feed', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(DevFeed, {overrides: el => [
    {key: 'username', fn: () => text('username', el.username || 'bennypowers', 'Element')},
    {key: 'sort', fn: () => select('sort', {
      "By Popularity": 'popularity',
      "By Date, Descdending": 'date',
      "By Date, Ascending": 'date-asc',
    }, el.username || 'popularity', 'Element')}
  ]
  }), { notes: { markdown: readme } })
