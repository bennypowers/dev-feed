import { html, fixture, expect } from '@open-wc/testing';

import { stub } from 'sinon';

import './dev-feed.js';

describe('DevFeed', function() {
  it('by default sorts by popularity', async () => {
    const el = await fixture(html`
      <dev-feed></dev-feed>
    `);

    expect(el.sort).to.equal('popularity');
  });

  it('shows an empty list initially', async () => {
    const el = await fixture(html`
      <dev-feed></dev-feed>
    `);

    expect(el).shadowDom.to.equal(`
      <div hidden></div>
      <ul id="posts"></ul>
    `);
  });

  describe('with username property', function() {
    const username = 'test';
    const endpoint = `https://dev.to/api/articles?username=${username}`;
    let fetchStub;
    let el;
    beforeEach(async function() {
      fetchStub = stub(window, 'fetch');
      fetchStub.returns(Promise.resolve(new Response(JSON.stringify([
        {
          cover_image: 'cover_image',
          description: 'description',
          positive_reactions_count: 100,
          published_at: 'published_at',
          tag_list: ['tag'],
          title: 'title',
          url: 'url',
          user: {
            name: 'user.name',
            profile_image_90: 'user.profile_image_90',
            username: 'user.username',
          },
        },
      ]), {
        status: 200,
        headers: { 'Content-type': 'application/json' },
      })));

      el = await fixture(html`
        <dev-feed username="${username}"></dev-feed>
      `);

      await new Promise(r => setTimeout(r, 1000));
    });

    afterEach(function() {
      fetchStub.restore();
      el.remove();
      el = undefined;
    });

    it('should set the apiEndpoint property', function() {
      expect(`${el.apiEndpoint}`).to.equal(endpoint);
    });

    it('should display the fetched article', async function() {
      expect(el).shadowDom.to.equal(`
      <div hidden></div>
      <ul id="posts">
        <li>
          <dev-article>
          </dev-article>
        </li>
      </ul>
      `);
    });
  });
});
