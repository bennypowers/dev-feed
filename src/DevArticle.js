import { html, css, LitElement } from 'lit-element';
import formatWithOptions from 'date-fns/fp/formatWithOptions'
import formatDistanceWithOptions from 'date-fns/fp/formatDistanceWithOptions'
import parseISO from 'date-fns/fp/parseISO'

const compose = (f, g) => x => f(g(x));

const formatDate = compose(formatWithOptions({ awareOfUnicodeTokens: true }, 'MMM d'), parseISO)
const formatHuman = compose(formatDistanceWithOptions({ addSuffix: true }, new Date()), parseISO)

const tagTemplate = tag => html`
  <li><a href="https://dev.to/t/${tag}" rel="noopener nofollow">#${tag}</a></li>
`

export default class DevArticle extends LitElement {
  static get is() {
    return 'dev-article'
  }

  static get properties() {
    return {
      article: { type: Object },
      showDescription: { type: Boolean, attribute: 'show-description', reflect: true }
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        overflow: hidden;
        border: 1px solid hsla(0, 0%, 72.9%, 0.5);
        border-radius: 3px;
        box-shadow: hsl(0, 0%, 72.9%) 3px 3px 0 0;
        margin: 10px 0 0 0;
        padding: 0;
        position: relative;
        transition-delay: 0s;
        transition-duration: 0.35s;
        transition-property: opacity;
        transition-timing-function: ease-in;
        width: 100%;
        max-width: var(--dev-article-max-width);

        --dev-article-avatar-size: 48px;
        --dev-article-padding: 12px;
      }

      article {
        display: grid;
        grid-template-columns: calc(var(--dev-article-avatar-size) + (2 * var(--dev-article-padding))) auto;
        grid-template-areas:
          'figure figure figure'
          'avatar metadata metadata'
          'description description description'
          'count actions actions';
      }

      figure {
        grid-area: figure;
        margin: 0;
        width: 100%;
      }

      figcaption {
        padding: 0 var(--dev-article-padding);
      }

      #tags a,
      figcaption a {
        color: inherit;
        text-decoration: none;
      }

      #cover {
        grid-area: cover;
      }

      :host(:hover) #cover {
        opacity: 0.9;
      }

      #cover img {
        width: 100%;
      }

      #title {
        grid-area: title;
      }

      #title h3 {
        font-size: calc(22px + 1.7vw);
        font-weight: 500;
        margin: 8px 0;
        padding: 0;
      }

      #metadata {
        margin-left: 7px;
        grid-area: metadata;
      }

      #metadata > a {
        text-decoration: none;
        color: hsl(0, 0%, 40%);
      }

      #metadata > a:hover {
        color: hsl(0, 0%, 30%);
      }

      #tags a:hover,
      #metadata a:hover :not(#relative-time) {
        text-decoration: underline;
      }

      #avatar {
        border-radius: 100%;
        justify-self: center;
        overflow: hidden;
        height: var(--dev-article-avatar-size);
        width: var(--dev-article-avatar-size);
      }

      #avatar img {
        width: var(--dev-article-avatar-size);
      }

      #relative-time {
        font-size: 80%;
        font-weight: 400;
        text-decoration: none;
      }

      #tags {
        list-style-type: none;
        font-size: 16px;
        margin: 4px 0 0 0;
        padding: 0;
      }

      #tags li {
        display: inline;
      }

      #positive-reactions {
        display: flex;
        align-items: center;
        color: var(--theme-secondary-color, hsl(0, 0%, 40%));
        font-size: 15px;
        grid-area: count;
        padding: var(--dev-article-padding);
      }

      #positive-reactions img {
        width: 26px;
        height: 20px;
        margin-right: 7px;
      }

      #positive-reactions abbr {
        text-decoration: none;
      }

      #actions {
        display: flex;
        grid-area: actions;
        justify-content: end;
      }

      #actions button {
        border: none;
        background: none;
      }

      details {
        grid-area: description;
      }
`;
  }
  render() {
    const {
      cover_image: coverImage,
      description,
      positive_reactions_count: positiveReactionsCount,
      published_at: publishedAt,
      tag_list: tagList,
      title,
      type_of: typeOf,
      url,
      user
    } = this.article;

    const {
      github_username: github,
      name,
      profile_image_90: avatar,
      twitter_username: twitter,
      username,
      website_url,
    } = user || {}

    return html`
      <article aria-labelledby="title">
        <figure>
          <a id="cover" ?hidden="${!coverImage}" href="${url}" rel="norefer noopener nofollow">
            <img src="${coverImage}" role="presentation"/>
          </a>

          <figcaption>
            <a id="title" href="${url}" rel="noopener norefer">
              <h3>${title}</h3>
            </a>
          </figcaption>
        </figure>

        <a id="avatar" href="https://dev.to/${username}" rel="norefer noopener nofollow">
          <img src="${avatar}" alt="${name || username}'s Avatar"/>
        </a>

        <section id="metadata">
          <a href="https://dev.to/${username}" rel="norefer noopener nofollow">
            <span>${name || username} • <time>${formatDate(publishedAt)}</time></span>
            <span id="relative-time">(${formatHuman(publishedAt)})</span>
          </a>
          <ul id="tags">${tagList.map(tagTemplate)}</ul>

          <details ?open="${this.showDescription}">
            <summary hidden></summary>
            ${description}
          </details>
        </section>

        <span id="positive-reactions">
          <abbr title="Number of Positive Reactions">
            <img src="https://practicaldev-herokuapp-com.freetls.fastly.net/assets/reactions-stack-4bb9c1e4b3e71b7aa135d6f9a5ef29a6494141da882edd4fa971a77abe13dbe7.png" role="presentation"/>
          </abbr>
          ${positiveReactionsCount}
        </span>

        <section id="actions">
          <button @click="${this.toggleDescription}" title="Show Description">💬</button>
        </section>
      </article>
    `;
  }

  toggleDescription() {
    this.showDescription = !this.showDescription;
  }
}
