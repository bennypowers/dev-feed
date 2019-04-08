# `<dev-feed>`

Displays a feed for a [dev.to](https://dev.to) user

This web component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation
```bash
npm i -S dev-feed
npx @pika/web
```

## Usage
```html
<script type="module" src="/web_modules/dev-feed.js"></script>

<dev-feed username="bennypowers" sort="date" show-descriptions></dev-feed>
```

## Styling

Exposes the following CSS Custom Properties

|Property|Description|Default|
|-----|-----|-----|
|`--dev-feed-margin`|margin property of the main element|`15px`|
|`--dev-feed-padding`|padding property of the main element|`25px`|
|`--dev-feed-max-width`|max-width of the main element|`604px`|
|`--dev-article-margin`|margin of each article element|`10px 0 0 0`|
|`--dev-article-max-width`|max-width of each article element|`604px`|
|`--dev-article-padding`|padding property of each article element|`12px`|
|`--dev-article-avatar-size`|size of the user avatar in each article|`48px 0 0 0`|
