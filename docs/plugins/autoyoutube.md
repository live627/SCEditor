---
group: plugins
title: AutoYoutube
excerpt: Automatically converts pasted YouTube links into video embeds.
---
Automatically converts YouTube links pasted into the editor into video embeds.

## Initialise

To enable this plugin add `autoyoutube` to the `plugins` option. e.g.

```html
<script>
sceditor.create(textarea, {
	plugins: 'autoyoutube',
    style: 'minified/themes/content/default.min.css'
});
</script>
```

That's it! Now whenever a YouTube link is pasted it will be converted to an
embed instead.
