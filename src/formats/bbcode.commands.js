var
	escapeEntities  = sceditor.escapeEntities,
	getEditorCommand = sceditor.command.get,
	commands = {
		bold: {
			txtExec: ['[b]', '[/b]']
		},
		italic: {
			txtExec: ['[i]', '[/i]']
		},
		underline: {
			txtExec: ['[u]', '[/u]']
		},
		strike: {
			txtExec: ['[s]', '[/s]']
		},
		subscript: {
			txtExec: ['[sub]', '[/sub]']
		},
		superscript: {
			txtExec: ['[sup]', '[/sup]']
		},
		left: {
			txtExec: ['[left]', '[/left]']
		},
		center: {
			txtExec: ['[center]', '[/center]']
		},
		right: {
			txtExec: ['[right]', '[/right]']
		},
		justify: {
			txtExec: ['[justify]', '[/justify]']
		},
		font: {
			txtExec: function (caller) {
				var editor = this;

				getEditorCommand('font')._dropDown(
					editor,
					caller,
					function (fontName) {
						editor.insertText(
							'[font=' + fontName + ']',
							'[/font]'
						);
					}
				);
			}
		},
		size: {
			txtExec: function (caller) {
				var editor = this;

				getEditorCommand('size')._dropDown(
					editor,
					caller,
					function (fontSize) {
						editor.insertText(
							'[size=' + fontSize + ']',
							'[/size]'
						);
					}
				);
			}
		},
		color: {
			txtExec: function (caller) {
				var editor = this;

				getEditorCommand('color')._dropDown(
					editor,
					caller,
					function (color) {
						editor.insertText(
							'[color=' + color + ']',
							'[/color]'
						);
					}
				);
			}
		},
		bulletlist: {
			txtExec: function (caller, selected) {
				var content = '';

				for (const line of selected.split(/\r?\n/)) {
					content += (content ? '\n' : '') +
							'[li]' + line + '[/li]';
				}

				this.insertText('[ul]\n' + content + '\n[/ul]');
			}
		},
		orderedlist: {
			txtExec: function (caller, selected) {
				var content = '';

				for (const line of selected.split(/\r?\n/)) {
					content += (content ? '\n' : '') +
							'[li]' + line + '[/li]';
				}

				this.insertText('[ol]\n' + content + '\n[/ol]');
			}
		},
		table: {
			txtExec: ['[table][tr][td]', '[/td][/tr][/table]']
		},
		horizontalrule: {
			txtExec: ['[hr]']
		},
		code: {
			txtExec: ['[code]', '[/code]']
		},
		image: {
			txtExec: function (caller, selected) {
				var	editor  = this;

				getEditorCommand('image')._dropDown(
					editor,
					caller,
					selected,
					function (url, width, height, alt) {
						var attrs  = '';

						if (width) {
							attrs += ' width="' +
									escapeEntities(width, true) + '"';
						}

						if (height) {
							attrs += ' height="' +
									escapeEntities(height, true) + '"';
						}

						if (alt) {
							attrs += ' alt="' +
									escapeEntities(alt, true) + '"';
						}

						editor.insertText(
							'[img' + attrs + ']' + url + '[/img]'
						);
					}
				);
			}
		},
		email: {
			txtExec: function (caller, selected) {
				var	editor  = this;

				getEditorCommand('email')._dropDown(
					editor,
					caller,
					function (url, text) {
						editor.insertText(
							'[email=' + url + ']' +
									(text || selected || url) +
								'[/email]'
						);
					}
				);
			}
		},
		link: {
			txtExec: function (caller, selected) {
				var	editor  = this;

				getEditorCommand('link')._dropDown(
					editor,
					caller,
					function (url, text) {
						editor.insertText(
							'[url=' + url + ']' +
									(text || selected || url) +
								'[/url]'
						);
					}
				);
			}
		},
		quote: {
			txtExec: ['[quote]', '[/quote]']
		},
		youtube: {
			txtExec: function (caller) {
				var editor = this;

				getEditorCommand('youtube')._dropDown(
					editor,
					caller,
					function (id) {
						editor.insertText('[youtube]' + id + '[/youtube]');
					}
				);
			}
		},
		rtl: {
			txtExec: ['[rtl]', '[/rtl]']
		},
		ltr: {
			txtExec: ['[ltr]', '[/ltr]']
		}
	};

export default commands;
