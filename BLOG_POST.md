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

- properties (showDescriptions, sort, username)
- rendering the template
- fetching posts
- sorting (curry)
- debouncing

## Implementing our Article Element
Whereas the feed element was long on logic and short on presentation, the article element is where we get to hone our semantic-HTML-and-CSS-fu.

- CSS grid
- Semantic elements
- Details with lit-html

## Final Code
