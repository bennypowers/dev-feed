Dev.to user [Andrew Healey](https://dev.to/healeycodes) published a lovely article last week showing how to use the dev.to API to embed posts in your page. His work inspired me to build a (surprise!) web component which would make that even easier. Let's build a dev.to web component!

## Overview
Our component will have two parts:
1. `<dev-feed>`, a list component
1. `<dev-feed-article>`, an article component

The main component, `<dev-feed>` will be responsible for fetching and sorting the articles, and `<dev-feed-article>` will be responsible for displaying each article.

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

The first, in dash-case, is the file which users will import in order to register the custom element to their page. The second, in PascalCase, contains the element class, extending from LitElement. If you're not entirely clear on what I mean by those things, check out my post on [lit-element](https://dev.to/bennypowers/lets-build-web-components-part-5-litelement-906). It's cool, I'll wait. Good? alright...

You'll also see a demo folder with an index.html inside. As we write our component, you can run the owc-dev-server on that file to see how your component looks.

```
npm start
```
