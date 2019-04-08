Dev.to user [Andrew Healey](https://dev.to/healeycodes) published a lovely article last week showing how to use the dev.to API to embed posts in your page. His work inspired me to build a (surprise!) web component which would make that even easier. Let's build a dev.to web component!

## Overview
Our component will have two parts:
1. `<dev-feed>`, a list component
1. `<dev-article>`, an article component

The main component, `<dev-feed>` will be responsible for fetching and sorting the articles, and `<dev-article>` will be responsible for displaying each article.

So let's start with the container, and work our way down to the details of the article.

## Step 1: Scaffolding
Let's use [open-wc](https://open-wc.org)'s tools to get a head start on our component:

1. run `npm init @open-wc`
  1. choose `Scaffold a new project`
  1. choose `Lit Element Web Component`
  1. enter the name `dev-feed`
1. open your editor `atom -a dev-feed`

You'll see two files under `src`:

```
- dev-feed.js
- DevFeed.js
```

The first, in dash-case, is the file which users will import in order to register the custom element to their page. The second, in PascalCase, contains the element class, extending from `LitElement`. If you're not entirely clear on what I mean by those things, check out my post on [lit-element](https://dev.to/bennypowers/lets-build-web-components-part-5-litelement-906). It's cool, I'll wait. Good? alright...

You'll also see a demo folder with an index.html inside. As we write our component, you can run the owc-dev-server on that file to see how your component looks.

```
npm start
```

We're going to practice a little README-driven-development, or demo-driven-development. Meaning, we'll decide our element's external API and write that into our demo, then work on bringing the code up to our standards. Let's use the JavaScript Proxy and lit-html to hack together a simple purpose-built reactive renderer

```js
const properties = new Proxy({
  showDescriptions: false,
  sort: 'popularity',
  username: 'bennypowers'
}, {
  set(obj, prop, value) {
    obj[prop] = value
    update();
    return true
  }
});
```

This proxy holds a mapping of our element's props, and it will call our `update` function any time one of our values is set.

```js
const update = ({ showDescriptions, sort, username } = properties) => render(html`
  <dev-feed id="component"
      username="${username}"
      sort="${sort}"
      ?show-descriptions="${showDescriptions}"
  ></dev-feed>

  <input id="username"
      @change="${onUsernameChange}"
      value="${username}"/>
  <input id="show-descriptions" type="checkbox"
      @change="${onShowDescriptionsChange}"
      ?checked="${showDescriptions}"/>
  <select id="sort" @change="${onSortByChange}" value="${sort}">
    <option value="popularity">Popularity</option>
    <option value="date">Date, Descending</option>
    <option value="date-asc">Date, Ascending</option>
  </select>
`, document.body);
```

Here we provide a few controls to set our component's properties. The event handlers each grab the relevant value and set it on `properties`, which triggers the render. Nice 😎.

## Implementing our Feed Element
Now that our demo is wired up, it's time to set up our feed element's internal logic and template. We'll start with a simple implementation and work up to the final product, refreshing our demo app as we go.

The first and easiest step will be to define our observed properties.

```js
static get properties() {
  return {
    loading: { type: Boolean },
    posts: { type: Array },
    showDescriptions: { type: Boolean, attribute: 'show-descriptions' }
    sort: { type: String, reflect: true },
    username: { type: String },
  }
}

constructor() {
 super();
 this.posts = [];
 this.sort = 'popularity';
}
```

Note the `attribute` specified for `showDescriptions`, that's because HTML attributes are always lowercased, so here we explicitly link the dash-case attribute with the camelCase property. We also set some defaults in the constructor, especially for the `posts` property, which will be our private list of articles fetched from dev.to.

Next, let's set up the feed components's template. Compared to the article it's markup is quite simple:

```js
render() {
  const { loading, posts, postTemplate, sort } = this;
  const parseAsTimestamp = s => new Date(s).getTime();
  const sorter = (
      sort === 'popularity' ? propGt('positive_reactions_count')
    : sort === 'date' ? mapPropGt(parseAsTimestamp, 'published_at')
    : sort === 'date-asc' ? mapPropLt(parseAsTimestamp, 'published_at')
    : identity
  );

  return html`
    <div ?hidden="${!loading}">${loadingTemplate}</div>
    <ul id="posts" ?hidden="${loading}">
      ${posts
        .sort(sorter)
        .map(postTemplate)}
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

```

What's happening with the `sorter`? Well, the early-days dev.to API doesn't yet have advanced controls on `GET /api/articles`, so we're doing some client-side sorting. For this project, I decided to implement the article sorting with some functional JavaScript. `mapPropGt` and `mapPropLt` both compose a function called `mapPropCompare` which, for two input values,

1. Gets a property from each input
1. Maps some function over that value
1. Applies some comparison function to the two terms

The only difference between the two versions is that the less-than variety flips the first two arguments to the comparison function before applying.

```js
const identity = x => x;

const sub = (x, y) => x - y;

const flip = f => (y, x, ...rest) => f(x, y, ...rest);

const mapPropCompare = curry((f, g, prop, x, y) => f(g(y[prop]), g(x[prop])));

const mapPropGt = mapPropCompare(sub);

const mapPropLt = mapPropCompare(flip(sub));

const propGt = mapPropGt(identity);
```

For a short intro to this style of programming, check out my slide deck [Starting Functional JavaScript](https://bennypowers.dev/starting-functional-javascript).

### Fetching Posts
Now that we have our basic template set up, let's write the code which will actually fetch posts from dev.to. We'll write four methods to handle this: one to generate a url, one to fetch the posts, and one to assign the results to the component.

```js
get apiEndpoint() {
  const { username } = this;
  if (!username) return null;
  const search = new URLSearchParams({ username });
  const API_ENDPOINT = new URL('api/articles', 'https://dev.to');
        API_ENDPOINT.search = search;
  return API_ENDPOINT;
}

async updated(changed) {
  if (changed.has('username')) this.fetchPosts();
}

assignPosts(posts) {
  this.posts = posts || [];
  this.loading = false;
}

async fetchPosts() {
  const { apiEndpoint } = this;
  if (!apiEndpoint) return;
  this.loading = true;
  return fetch(apiEndpoint)
    .then(handleAsJson)
    .then(this.assignPosts);
}
```

We also need to bind `assignPosts` and `postTemplate` in the constructor so that we can destructure them and pass them first-class:

```js
this.postTemplate = this.postTemplate.bind(this);
this.assignPosts = this.assignPosts.bind(this);
```

For the URL, I decided to reach for the built-in `URL` and `URLSearchParams` constructors. We could just as easily have used string interpolation i.e. ``https://dev.to/api/articles?username=${username}``, but doing it this way lets us easily add more parameters should the need arise. Also makes me feel like I'm getting my money's worth from the built-ins :wink:

### Debouncing Fetch Requests
The last thing we'll do in the feed component is debounce requests to the server. Debouncing means deferring execution until a certain time has passed since the last call. It's a useful technique when you have an expensive operation (such as fetching data over the network, or certain kinds of paint-heavy DOM updates) that fires based on user input (like typing or scrolling). In effect, we're telling our component: "Fetch articles when the user types in a username, but before committing to send the request, wait half a second to make sure they're finished typing."

```js
import { debounce } from './debounce.js';
/* ... */

constructor() {
  super();
  /* ... */
  this.fetchPosts = debounce(this.fetchPosts.bind(this), 500);
}
```

If we would reload our demo page now, we wouldn't see anything, because the `<dev-article>` component hasn't been defined. But, if we inspected our element's shadow root, we'd see several `<dev-article>` elements, each one with its own `article` DOM property.

![Screenshot from Firefox Dev Tools Showing the article DOM property of a dev-article element]()

Next we'll get to work laying out each article according to the design on dev.to.

## Implementing our Article Element
Whereas the feed element was long on logic and short on presentation, the article element is where we get to hone our semantic-HTML-and-CSS-fu.

Each `<dev-article>` element will internally render an `<article>` element, with a few more semantic HTML goodies as siblings. We'll use CSS grid to lay everything out without adding extraneous `<div>`s.

```js
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
    user: {
      name,
      profile_image_90: avatar,
      username,
    },
  } = this.article;

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
        <img
            src="https://practicaldev-herokuapp-com.freetls.fastly.net/assets/reactions-stack-4bb9c1e4b3e71b7aa135d6f9a5ef29a6494141da882edd4fa971a77abe13dbe7.png"
            alt="Circled heart on a stack of similar circles"
            title="Number of Positive Reactions"/>
        ${positiveReactionsCount}
      </span>

      <section id="actions">
        <button @click="${this.toggleDescription}" title="Show Description">💬</button>
      </section>
    </article>
  `;
}
```

So this is pretty straightforward semantic HTML, but there are a few goodies to enjoy:

- Let's use lit-element to bind a button elsewhere in the DOM to our `<details>` element's `open` state.
- We'll add a hidden `<summary>` element so that the UA doesn't show us the default disclosure widget.
- We'll use the [`<time>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time) element (ten points for you if you already knew this exists) to display the post date.
- We'll use named grid areas to define chunks of layout in CSS. See the final code for more.

## Final Code

So here's our component, running on stackblitz.
