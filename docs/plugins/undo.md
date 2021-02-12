---
group: plugins
title: Undo
excerpt: Enables undo/redo functionality in SCEditor
---
This plugin adds undo / redo support to SCEditor.


## Initialise

To enable the undo plugin add `undo` to the `plugins` option. e.g.

```html
<script>
sceditor.create(textarea, {
	plugins: 'undo',
	style: 'minified/themes/content/default.min.css'
});
</script>
```

That's it!

The shortcuts `ctrl+z`, `ctrl+shift+z` and `ctrl+y` should now work consistently
across all browsers.
