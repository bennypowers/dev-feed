import { html, css, svg, LitElement } from 'lit-element';
import { debounce } from './debounce.js';

import { curry } from './curry.js';

import './dev-article.js';

const handleAsJson = response => response.json();

const parseAsTimestamp = s => new Date(s).getTime();

const identity = x => x;

const sub = (x, y) => x - y;

const flip = f => (y, x, ...rest) => f(x, y, ...rest);

const mapPropCompare = curry((f, g, prop, x, y) => f(g(y[prop]), g(x[prop])));

const mapPropGt = mapPropCompare(sub);

const mapPropLt = mapPropCompare(flip(sub));

const propGt = mapPropGt(identity);

const loadingContent = svg`
<svg id="loading-content" viewBox="0 0 609 476" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <rect id="a" x="1" y="1" width="604" height="471.017" rx="3"/>
    <filter x="-.3%" y="-.4%" width="101.2%" height="101.5%" filterUnits="objectBoundingBox" id="b">
      <feMorphology radius=".5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"/>
      <feOffset dx="3" dy="3" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/>
      <feComposite in="shadowOffsetOuter1" in2="SourceAlpha" operator="out" result="shadowOffsetOuter1"/>
      <feColorMatrix values="0 0 0 0 0.729 0 0 0 0 0.729 0 0 0 0 0.729 0 0 0 1 0" in="shadowOffsetOuter1"/>
    </filter>
    <rect id="e" x="1" y="1" width="604" height="471.017" rx="3"/>
    <filter x="-.3%" y="-.4%" width="101.2%" height="101.5%" filterUnits="objectBoundingBox" id="d">
      <feMorphology radius=".5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"/>
      <feOffset dx="3" dy="3" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/>
      <feComposite in="shadowOffsetOuter1" in2="SourceAlpha" operator="out" result="shadowOffsetOuter1"/>
      <feColorMatrix values="0 0 0 0 0.729 0 0 0 0 0.729 0 0 0 0 0.729 0 0 0 1 0" in="shadowOffsetOuter1"/>
    </filter>
  </defs>
  <g fill="none" fill-rule="evenodd">
    <mask id="c" fill="#fff">
      <use xlink:href="#a"/>
    </mask>
    <use fill="#000" filter="url(#b)" xlink:href="#a"/>
    <use stroke-opacity=".5" stroke="#BABABA" fill="#FFF" xlink:href="#a"/>
    <g mask="url(#c)">
      <use fill="#000" filter="url(#d)" xlink:href="#e"/>
      <use stroke-opacity=".5" stroke="#BABABA" fill="#FFF" xlink:href="#e"/>
    </g>
    <path fill="#BABABA" mask="url(#c)" d="M1 1h604v253.667H1z"/>
    <rect fill="#BABABA" mask="url(#c)" x="15" y="276" width="536" height="34" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="15" y="325" width="388" height="34" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="81" y="380" width="292" height="16" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="81" y="405" width="128" height="16" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="216" y="405" width="96" height="16" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="319" y="405" width="128" height="16" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="454" y="405" width="47" height="16" rx="3"/>
    <rect fill="#BABABA" mask="url(#c)" x="46" y="437" width="35" height="16" rx="3"/>
    <circle fill="#BABABA" mask="url(#c)" cx="38" cy="400" r="24"/>
    <circle fill="#BABABA" mask="url(#c)" cx="25" cy="445" r="10"/>
  </g>
</svg>
`;

/**
 * Web component to display a feed of dev.to posts for a given username
 * @element
 * @cssprop --dev-article-max-width - max width for articles. default 604px
 */
export default class DevFeed extends LitElement {
  static get is() {
    return 'dev-feed';
  }

  static get styles() {
    return css`
      [hidden] {
        display: none !important;
      }

      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 18px;
        margin: 15px;
        color: hsl(0, 0%, 3.9%);
        padding: 25px;
        position: relativei;

        --dev-article-max-width: 604px;
      }

      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      #loading-content {
        max-width: var(--dev-article-max-width);
      }
`;
  }

  static get properties() {
    return {
      /**
       * Property by which to sort posts (client-side)
       * @type {'popularity'|'date'|'date-asc'}
       * @attr sort
       */
      sort: { type: String, reflect: true },

      /**
       * Posts fetched from dev.to
       * @type {import('./dev-article').DevPost[]}
       */
      posts: { type: Array },

      /**
       * Username
       * @type {string}
       * @attr username
       */
      username: { type: String },

      /**
       * Whether a request to dev.to is in-flight
       * @type {boolean}
       * @attr loading
       */
      loading: { type: Boolean, reflect: true },

      /**
       * Whether articles in the list should display the description
       * @type {boolean}
       * @attr show-descriptions
       */
      showDescriptions: { type: Boolean, attribute: 'show-descriptions' },
    };
  }

  /**
   * The REST resource at dev.to from which to fetch posts
   * @return {string} e.g. https://dev.to/api/articles?username=my-user-name
   */
  get apiEndpoint() {
    const { username } = this;
    if (!username) return null;
    const search = new URLSearchParams({ username });
    const API_ENDPOINT = new URL('api/articles', 'https://dev.to');
    API_ENDPOINT.search = search;
    return API_ENDPOINT;
  }

  constructor() {
    super();
    this.posts = [];
    this.sort = 'popularity';
    this.assignPosts = this.assignPosts.bind(this);
    this.postTemplate = this.postTemplate.bind(this);
    this.fetchPosts = debounce(this.fetchPosts.bind(this), 500, true);
  }

  render() {
    const { loading, posts, postTemplate, sort } = this;
    const sorter = (
        sort === 'popularity' ? propGt('positive_reactions_count') :
      sort === 'date' ? mapPropGt(parseAsTimestamp, 'published_at') :
      sort === 'date-asc' ? mapPropLt(parseAsTimestamp, 'published_at') :
      identity
    );

    return html`
      <div ?hidden="${!loading}">${loadingContent}</div>
      <ul id="posts" ?hidden="${loading}">
        ${posts.sort(sorter).map(postTemplate)}
      </ul>
    `;
  }

  postTemplate(post) {
    return html`
      <li>
        <dev-article
            .article="${post}"
            ?show-description="${this.showDescriptions}"
        ></dev-article>
      </li>`;
  }

  async updated(changed) {
    if (changed.has('username') && this.username) this.fetchPosts();
  }

  assignPosts(posts) {
    this.posts = posts || [];
    this.loading = false;
    return posts;
  }

  async fetchPosts() {
    const { apiEndpoint } = this;
    if (!apiEndpoint) return;
    this.loading = true;
    return fetch(apiEndpoint)
      .then(handleAsJson)
      .then(this.assignPosts);
  }
}
