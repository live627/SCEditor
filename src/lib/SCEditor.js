import createNanoEvents from './events.js';
import * as dom from './dom.js';
import * as utils from './utils.js';
import defaultOptions from './defaultOptions.js';
import defaultCommands from './defaultCommands.js';
import PluginManager from './PluginManager.js';
import RangeHelper from './RangeHelper.js';
import Dropdown from './dropdown.js';
import Popup from './popup.js';
import _tmpl from './templates.js';
import * as escape from './escape.js';
import * as browser from './browser.js';

var globalWin  = window;
var globalDoc  = document;

var IE_VER = browser.ie;

// In IE < 11 a BR at the end of a block level element
// causes a line break. In all other browsers it's collapsed.
var IE_BR_FIX = IE_VER && IE_VER < 11;

var IMAGE_MIME_REGEX = /^image\/(p?jpe?g|gif|png|bmp)$/i;

/**
 * Wrap inlines that are in the root in paragraphs.
 *
 * @param {HTMLBodyElement} body
 * @param {Document} doc
 * @private
 */
function wrapInlines(body, doc)
{
	var wrapper;

	dom.traverse(body, function (node)
	{
		if (dom.isInline(node, true))
		{
			if (!wrapper)
			{
				wrapper = dom.createElement('p', {}, doc);
				dom.insertBefore(wrapper, node);
			}
			if (node.nodeType !== dom.TEXT_NODE || node.nodeValue !== '')
				dom.appendChild(wrapper, node);
		}
		else
			wrapper = null;
	}, false, true);
};

/**
 * SCEditor - A lightweight WYSIWYG editor
 *
 * @param {HTMLTextAreaElement} original The textarea to be converted
 * @param {object} userOptions
 * @class SCEditor
 * @name SCEditor
 */
export default function SCEditor(original, userOptions)
{
	/**
	 * Alias of this
	 *
	 * @private
	 */
	var base = this;

	/**
	 * Editor format like BBCode or HTML
	 */
	var format;

	/**
	 * The div which contains the editor and toolbar
	 *
	 * @type {HTMLDivElement}
	 * @private
	 */
	var editorContainer;

	/**
	 * Map of events handlers bound to this instance.
	 *
	 * @type {object}
	 * @private
	 */
	var eventHandlers = {};

	/**
	 * The editors toolbar
	 *
	 * @type {HTMLDivElement}
	 * @private
	 */
	var toolbar;

	/**
	 * The editors iframe which should be in design mode
	 *
	 * @type {HTMLIFrameElement}
	 * @private
	 */
	var wysiwygEditor;

	/**
	 * The editors window
	 *
	 * @type {Window}
	 * @private
	 */
	var wysiwygWindow;

	/**
	 * The WYSIWYG editors body element
	 *
	 * @type {HTMLBodyElement}
	 * @private
	 */
	var wysiwygBody;

	/**
	 * The WYSIWYG editors document
	 *
	 * @type {Document}
	 * @private
	 */
	var wysiwygDocument;

	/**
	 * The editors textarea for viewing source
	 *
	 * @type {HTMLTextAreaElement}
	 * @private
	 */
	var sourceEditor;

	/**
	 * If the user is currently composing text via IME
	 *
	 * @type {boolean}
	 */
	var isComposing;

	/**
	 * Timer for valueChanged key handler
	 *
	 * @type {number}
	 */
	var valueChangedKeyUpTimer;

	/**
	 * The editors rangeHelper instance
	 *
	 * @type {RangeHelper}
	 * @private
	 */
	var rangeHelper;

	/**
	 * An array of button state handlers
	 *
	 * @type {Array.<object>}
	 * @private
	 */
	var btnStateHandlers = [];

	/**
	 * Plugin manager instance
	 *
	 * @type {PluginManager}
	 * @private
	 */
	var pluginManager;

	/**
	 * The current node containing the selection/caret
	 *
	 * @type {Node}
	 * @private
	 */
	var currentNode;

	/**
	 * The first block level parent of the current node
	 *
	 * @type {node}
	 * @private
	 */
	var currentBlockNode;

	/**
	 * The current node selection/caret
	 *
	 * @type {object}
	 * @private
	 */
	var currentSelection;

	/**
	 * Used to make sure only 1 selection changed
	 * check is called every 100ms.
	 *
	 * Helps improve performance as it is checked a lot.
	 *
	 * @type {boolean}
	 * @private
	 */
	var isSelectionCheckPending;

	/**
	 * If content is required (equivalent to the HTML5 required attribute)
	 *
	 * @type {boolean}
	 * @private
	 */
	var isRequired;

	/**
	 * The inline CSS style element. Will be undefined
	 * until css() is called for the first time.
	 *
	 * @type {HTMLStyleElement}
	 * @private
	 */
	var inlineCss;

	/**
	 * Object containing a list of shortcut handlers
	 *
	 * @type {object}
	 * @private
	 */
	var shortcutHandlers = {};

	/**
	 * The min and max heights that autoExpand should stay within
	 *
	 * @type {object}
	 * @private
	 */
	var autoExpandBounds;

	/**
	 * Timeout for the autoExpand function to throttle calls
	 *
	 * @private
	 */
	var autoExpandThrottle;

	/**
	 * Last scroll position before maximizing so
	 * it can be restored when finished.
	 *
	 * @type {number}
	 * @private
	 */
	var maximizeScrollPosition;

	/**
	 * Stores the contents while a paste is taking place.
	 *
	 * Needed to support browsers that lack clipboard API support.
	 *
	 * @type {?DocumentFragment}
	 * @private
	 */
	var pasteContentFragment;

	var lastVal;

	/**
	 * Private functions
	 *
	 * @private
	 */
	var
		init,
		handleCommand,
		initEditor,
		initToolBar,
		initEvents,
		handlePasteEvt,
		handlePasteData,
		handleKeyDown,
		handleBackSpace,
		handleKeyPress,
		handleComposition,
		updateActiveButtons,
		appendNewLine,
		checkSelectionChanged,
		checkNodeChanged,
		autofocus,
		currentStyledBlockNode,
		triggerValueChanged,
		valueChangedBlur,
		valueChangedKeyUp,
		autoExpand;

	/**
	 * Options for this editor instance
	 *
	 * @name opts
	 */
	var options = Object.assign(defaultOptions, userOptions);

	/**
	 * The editors locale
	 *
	 * @private
	 */
	var locale = options.locale || {};

	/**
	 * All the commands supported by the editor
	 *
	 * @name commands
	 */
	var commands = userOptions.commands || defaultCommands;

	/**
	 * All the events supported by the editor
	 *
	 * The supported events are:
	 *
	 * * keyup
	 * * keydown
	 * * Keypress
	 * * blur
	 * * focus
	 * * nodechanged - When the current node containing
	 * 		the selection changes in WYSIWYG mode
	 * * contextmenu
	 * * selectionchanged
	 * * valuechanged
	 *
	 * @name events
	 */
	var events = createNanoEvents();

	base.commands = commands;
	base.opts = options;
	base.events = events;

	/**
	 * Creates the editor iframe and textarea
	 *
	 * @private
	 */
	init = function ()
	{
		original._sceditor = base;

		editorContainer = dom.createElement('div', {
			className: 'sceditor-container'
		});

		dom.insertBefore(editorContainer, original);

		base.dropdown = new Dropdown(editorContainer);
		base.popup = new Popup(editorContainer);

		// Locale DateTime format overrides any specified in the options
		if (locale && locale.dateFormat)
			options.dateFormat = locale.dateFormat;

		isRequired = original.required;
		original.required = false;

		var FormatCtor = window[options.format];
		format = FormatCtor ? new FormatCtor(options.parserOptions) : {};
		if (!FormatCtor)
			throw new Error(`Format plugin not found: ${options.format}`);

		base.opts.format = format;
		initEditor();
		pluginManager = new PluginManager(base);
		options.plugins.forEach(pluginManager.register);

		if ('init' in format)
			format.init.call(base);
		commands = base.commands;
		options = base.opts;

		// force into source mode if is a browser that can't handle
		// full editing
		if (!browser.isWysiwygSupported)
			base.toggleSourceMode();

		initToolBar();
		initEvents();

		// load any textarea value into the editor
		dom.hide(original);
		base.insert(original.value);

		var loaded = function ()
		{
			dom.off(globalWin, 'load', loaded);

			if (options.autofocus)
				autofocus();

			autoExpand();
			appendNewLine();
		};
		dom.on(globalWin, 'load', loaded);
		if (globalDoc.readyState === 'complete')
			loaded();
	};

	/**
	 * Creates the editor iframe and textarea
	 *
	 * @private
	 */
	initEditor = function ()
	{
		sourceEditor  = dom.createElement('textarea');
		wysiwygEditor = dom.createElement('iframe', {
			frameborder: 0,
			allowfullscreen: true
		});

		/*
		* This needs to be done right after they are created because,
		* for any reason, the user may not want the value to be tinkered
		* by any filters.
		*/
		if (options.startInSourceMode)
		{
			dom.addClass(editorContainer, 'sourceMode');
			dom.hide(wysiwygEditor);
		}
		else
		{
			dom.addClass(editorContainer, 'wysiwygMode');
			dom.hide(sourceEditor);
		}

		if (!options.spellcheck)
			dom.attr(editorContainer, 'spellcheck', 'false');

		if (globalWin.location.protocol === 'https:')
			dom.attr(wysiwygEditor, 'src', 'about:blank');

		// Add the editor to the container
		dom.appendChild(editorContainer, wysiwygEditor);
		dom.appendChild(editorContainer, sourceEditor);

		// TODO: make this optional somehow
		base.dimensions(
			options.width || dom.width(original),
			options.height || dom.height(original)
		);

		// Add IE version class to the HTML element so can apply
		// conditional styling without CSS hacks
		var className = IE_VER ? 'ie ie' + IE_VER : '';
		// Add ios to HTML so can apply CSS fix to only it
		className += browser.ios ? ' ios' : '';

		wysiwygDocument = wysiwygEditor.contentDocument;
		wysiwygDocument.open();
		wysiwygDocument.write(_tmpl('html', {
			attrs: ' class="' + className + '"',
			spellcheck: options.spellcheck ? '' : 'spellcheck="false"',
			charset: options.charset,
			style: options.style
		}));
		wysiwygDocument.close();

		wysiwygBody = wysiwygDocument.body;
		wysiwygWindow = wysiwygEditor.contentWindow;

		var tabIndex = dom.attr(original, 'tabindex');
		dom.attr(sourceEditor, 'tabindex', tabIndex);
		dom.attr(wysiwygEditor, 'tabindex', tabIndex);

		rangeHelper = new RangeHelper(wysiwygWindow);
	};

	/**
	 * Initialises events
	 *
	 * @private
	 */
	initEvents = function ()
	{
		var compositionEvents = 'compositionstart compositionend';
		var eventsToForward = 'keydown keyup keypress focus blur contextmenu';
		var checkSelectionEvents = 'onselectionchange' in wysiwygDocument ?
			'selectionchange' :
			'keyup focus blur contextmenu mouseup touchend click';

		dom.on(window, 'beforeunload', base.updateOriginal);
		dom.on(wysiwygBody, 'keypress', handleKeyPress);
		dom.on(wysiwygBody, 'keydown', handleKeyDown);
		dom.on(wysiwygBody, 'keydown', handleBackSpace);
		dom.on(wysiwygBody, 'keyup', appendNewLine);
		dom.on(wysiwygBody, 'blur', valueChangedBlur);
		dom.on(wysiwygBody, 'keyup', valueChangedKeyUp);
		dom.on(wysiwygBody, 'paste', handlePasteEvt);
		dom.on(wysiwygBody, compositionEvents, handleComposition);
		dom.on(wysiwygBody, checkSelectionEvents, checkSelectionChanged);
		dom.on(wysiwygBody, eventsToForward, base.events.emit.bind(null));

		dom.on(sourceEditor, 'blur', valueChangedBlur);
		dom.on(sourceEditor, 'keyup', valueChangedKeyUp);
		dom.on(sourceEditor, 'keydown', handleKeyDown);
		dom.on(sourceEditor, compositionEvents, handleComposition);
		dom.on(sourceEditor, eventsToForward, base.events.emit.bind(null));

		dom.on(wysiwygDocument, checkSelectionEvents, checkSelectionChanged);
		dom.on(wysiwygDocument, 'keyup', appendNewLine);

		dom.on(editorContainer, 'selectionchanged', checkNodeChanged);
		dom.on(editorContainer, 'selectionchanged', updateActiveButtons);

		if (options.autoExpand)
		{
			// Need to update when images (or anything else) loads
			dom.on(wysiwygBody, 'load', autoExpand, dom.EVENT_CAPTURE);
			dom.on(wysiwygBody, 'input', autoExpand);
			dom.on(sourceEditor, 'input', autoExpand);
		}
	};

	var stopEvent = e =>
	{
		e.preventDefault();
	};

	var handleClick = e =>
	{
		if (!dom.hasClass(this, 'disabled'))
			handleCommand(this, commands[dom.attr(e.target, 'data-sceditor-command')]);

		updateActiveButtons();
		stopEvent(e);
	};

	/**
	 * Creates the toolbar and appends it to the container
	 *
	 * @private
	 */
	initToolBar = function ()
	{
		var
			group,
			Icons = options.icons;

		toolbar = dom.createElement('div', {
			className: 'sceditor-toolbar'
		});
		options.icons = new Icons;

		for (var rowItems of options.toolbar)
		{
			var row = dom.createElement('div');

			for (var menuItems of rowItems)
			{
				group = dom.createElement('span');

				for (let commandName of menuItems)
				{
					let
						button,
						command = commands[commandName];

					// The commandName must be valid
					if (!command)
						continue;

					let
						shortcut = command.shortcut,
						tooltip = command.tooltip,
						attrs = {
							className: 'sceditor-button',
							'data-sceditor-command': commandName,
							title: base._(tooltip || commandName)
						};

					if (tooltip && shortcut)
						attrs.title += ` (${shortcut})`;

					button = dom.createElement('a', attrs);
					dom.appendChild(button, options.icons.create(commandName));
					dom.on(button, 'click', handleClick);

					// Prevent editor losing focus when button clicked
					dom.on(button, 'mousedown', stopEvent);

					if (shortcut)
						base.addShortcut(shortcut, commandName);

					if (command.state || utils.isString(command.exec))
						btnStateHandlers.push({
							name: commandName,
							button: button,
							state: command.state || command.exec
						});

					dom.appendChild(group, button);
				}

				// Exclude empty groups
				if (group.firstChild)
					dom.appendChild(row, group);
			}

			// Exclude empty rows
			if (row.firstChild)
				dom.appendChild(toolbar, row);
		}

		// Append the toolbar to the toolbarContainer option if given
		if (options.toolbarContainer)
			dom.appendChild(options.toolbarContainer, toolbar);
		else
			dom.insertBefore(toolbar, wysiwygEditor);
	};

	/**
	 * Autofocus the editor
	 *
	 * @private
	 */
	autofocus = function ()
	{
		var
			range, txtPos,
			node     = wysiwygBody.firstChild,
			focusEnd = !!options.autofocusEnd;

		// Can't focus invisible elements
		if (!dom.isVisible(editorContainer))
			return;

		if (base.isInSourceMode())
		{
			txtPos = focusEnd ? sourceEditor.value.length : 0;

			sourceEditor.setSelectionRange(txtPos, txtPos);

			return;
		}

		dom.removeWhiteSpace(wysiwygBody);

		if (focusEnd)
		{
			if (!(node = wysiwygBody.lastChild))
			{
				node = dom.createElement('p', {}, wysiwygDocument);
				dom.appendChild(wysiwygBody, node);
			}

			while (node.lastChild)
			{
				node = node.lastChild;

				// IE < 11 should place the cursor after the <br> as
				// it will show it as a newline. IE >= 11 and all
				// other browsers should place the cursor before.
				if (!IE_BR_FIX && dom.is(node, 'br') && node.previousSibling)
					node = node.previousSibling;

			}
		}

		range = wysiwygDocument.createRange();

		if (!dom.canHaveChildren(node))
		{
			range.setStartBefore(node);

			if (focusEnd)
				range.setStartAfter(node);
		}
		else
			range.selectNodeContents(node);

		range.collapse(!focusEnd);
		rangeHelper.selectRange(range);
		currentSelection = range;

		if (focusEnd)
			wysiwygBody.scrollTop = wysiwygBody.scrollHeight;

		base.focus();
	};

	/**
	 * Gets if the editor is read only
	 *
	 * @since 3.0.0
	 * @function
	 * @name isReadOnly
	 * @returns {boolean}
	 */
	base.isReadOnly = () => !sourceEditor.readonly;

	/**
	 * Sets if the editor is read only
	 *
	 * @param {boolean} readOnly
	 * @since 1.3.5
	 * @function
	 * @name readOnly
	 */
	base.readOnly = function (readOnly)
	{
		wysiwygBody.contentEditable = !readOnly;
		sourceEditor.readonly = !readOnly;
		dom.toggleClass(editorContainer, 'disabled', readOnly);
	};

	/**
	 * Gets the width of the editor in pixels
	 *
	 * @since 1.3.5
	 * @function
	 * @name width
	 * @returns {number}
	 */
	/**
	 * Sets the width of the editor
	 *
	 * @param {number} width Width in pixels
	 * @since 1.3.5
	 * @function
	 * @name width^2
	 * @returns {this}
	 */
	/**
	 * Sets the width of the editor
	 *
	 * The saveWidth specifies if to save the width. The stored width can be
	 * used for things like restoring from maximized state.
	 *
	 * @param {number}     width            Width in pixels
	 * @param {boolean}	[saveWidth=true] If to store the width
	 * @since 1.4.1
	 * @function
	 * @name width^3
	 * @returns {this}
	 */
	base.width = function (width, saveWidth)
	{
		if (!width && width !== 0)
			return dom.width(editorContainer);

		base.dimensions(width, null, saveWidth);

		return base;
	};

	/**
	 * Returns an object with the properties width and height
	 * which are the width and height of the editor in px.
	 *
	 * @since 1.4.1
	 * @function
	 * @name dimensions
	 * @returns {object}
	 */
	/**
	 * <p>Sets the width and/or height of the editor.</p>
	 *
	 * <p>If width or height is not numeric it is ignored.</p>
	 *
	 * @param {number}	width	Width in px
	 * @param {number}	height	Height in px
	 * @since 1.4.1
	 * @function
	 * @name dimensions^2
	 * @returns {this}
	 */
	/**
	 * <p>Sets the width and/or height of the editor.</p>
	 *
	 * <p>If width or height is not numeric it is ignored.</p>
	 *
	 * <p>The save argument specifies if to save the new sizes.
	 * The saved sizes can be used for things like restoring from
	 * maximized state. This should normally be left as true.</p>
	 *
	 * @param {number}		width		Width in px
	 * @param {number}		height		Height in px
	 * @param {boolean}	[save=true]	If to store the new sizes
	 * @since 1.4.1
	 * @function
	 * @name dimensions^3
	 * @returns {this}
	 */
	base.dimensions = function (width, height, save)
	{
		// set undefined width/height to boolean false
		width  = (!width && width !== 0) ? false : width;
		height = (!height && height !== 0) ? false : height;

		if (width === false && height === false)
			return { width: base.width(), height: base.height() };

		if (width !== false)
		{
			if (save !== false)
				options.width = width;

			dom.width(editorContainer, width);
		}

		if (height !== false)
		{
			if (save !== false)
				options.height = height;

			dom.height(editorContainer, height);
		}

		return base;
	};

	/**
	 * Gets the height of the editor in px
	 *
	 * @since 1.3.5
	 * @function
	 * @name height
	 * @returns {number}
	 */
	/**
	 * Sets the height of the editor
	 *
	 * @param {number} height Height in px
	 * @since 1.3.5
	 * @function
	 * @name height^2
	 * @returns {this}
	 */
	/**
	 * Sets the height of the editor
	 *
	 * The saveHeight specifies if to save the height.
	 *
	 * The stored height can be used for things like
	 * restoring from maximized state.
	 *
	 * @param {number} height Height in px
	 * @param {boolean} [saveHeight=true] If to store the height
	 * @since 1.4.1
	 * @function
	 * @name height^3
	 * @returns {this}
	 */
	base.height = function (height, saveHeight)
	{
		if (!height && height !== 0)
			return dom.height(editorContainer);

		base.dimensions(null, height, saveHeight);

		return base;
	};

	/**
	 * Gets if the editor is maximised or not
	 *
	 * @since 1.4.1
	 * @function
	 * @name maximize
	 * @returns {boolean}
	 */
	/**
	 * Sets if the editor is maximised or not
	 *
	 * @param {boolean} maximize If to maximise the editor
	 * @since 1.4.1
	 * @function
	 * @name maximize^2
	 * @returns {this}
	 */
	base.maximize = function (maximize)
	{
		var maximizeSize = 'sceditor-maximize';

		if (utils.isUndefined(maximize))
			return dom.hasClass(editorContainer, maximizeSize);

		maximize = !!maximize;

		if (maximize)
			maximizeScrollPosition = globalWin.pageYOffset;

		dom.toggleClass(globalDoc.documentElement, maximizeSize, maximize);
		dom.toggleClass(globalDoc.body, maximizeSize, maximize);
		dom.toggleClass(editorContainer, maximizeSize, maximize);
		base.width(maximize ? '100%' : options.width, false);
		base.height(maximize ? '100%' : options.height, false);

		if (!maximize)
			globalWin.scrollTo(0, maximizeScrollPosition);

		autoExpand();

		return base;
	};

	autoExpand = function ()
	{
		if (options.autoExpand && !autoExpandThrottle)
			autoExpandThrottle = setTimeout(base.expandToContent, 200);
	};

	/**
	 * Expands or shrinks the editors height to the height of it's content
	 *
	 * @function
	 * @name expandToContent
	 */
	base.expandToContent = function ()
	{
		if (base.maximize())
			return;

		clearTimeout(autoExpandThrottle);

		if (!autoExpandBounds)
			autoExpandBounds = [
				options.height || dom.height(original),
				globalDoc.documentElement.clientHeight - wysiwygBody.offsetTop
			];

		base.height(
			Math.max(
				Math.min(wysiwygBody.scrollHeight, autoExpandBounds[0]),
				autoExpandBounds[1]
			)
		);
	};

	/**
	 * Destroys the editor, removing all elements and
	 * event handlers.
	 *
	 * Leaves only the original textarea.
	 *
	 * @function
	 * @name destroy
	 */
	base.destroy = function ()
	{
		// Don't destroy if the editor has already been destroyed
		if (!pluginManager)
			return;

		pluginManager.destroy();
		base.dropdown.destroy();
		base.popup.destroy();

		rangeHelper   = null;
		pluginManager = null;
		base.dropdown = null;
		base.popup    = null;

		dom.off(window, 'unload', base.updateOriginal);
		dom.remove(sourceEditor);
		dom.remove(toolbar);
		dom.remove(editorContainer);

		delete original._sceditor;
		dom.show(original);

		original.required = isRequired;
	};

	/**
	 * Handles the WYSIWYG editors paste event
	 *
	 * @param e
	 * @private
	 */
	handlePasteEvt = function (e)
	{
		var isIeOrEdge = IE_VER || browser.edge;
		var editable = wysiwygBody;
		var clipboard = e.clipboardData;
		var loadImage = function (file)
		{
			var reader = new FileReader();
			reader.onload = function (e)
			{
				handlePasteData({
					html: '<img src="' + e.target.result + '" />'
				});
			};
			reader.readAsDataURL(file);
		};

		// Modern browsers with clipboard API - everything other than _very_
		// old android web views and UC browser which doesn't support the
		// paste event at all.
		if (clipboard && !isIeOrEdge)
		{
			var data = {};
			var types = clipboard.types;
			var items = clipboard.items;

			stopEvent(e);

			for (var i = 0; i < types.length; i++)
			{
				// Normalise image pasting to paste as a data-uri
				if (globalWin.FileReader && items &&
					IMAGE_MIME_REGEX.test(items[i].type))
					return loadImage(clipboard.items[i].getAsFile());

				data[types[i]] = clipboard.getData(types[i]);
			}
			// Call plugins here with file?
			data.text = data['text/plain'];
			data.html = data['text/html'];

			handlePasteData(data);
		// If contentsFragment exists then we are already waiting for a
		// previous paste so let the handler for that handle this one too
		}
		else if (!pasteContentFragment)
		{
			// Save the scroll position so can be restored
			// when contents is restored
			var scrollTop = editable.scrollTop;

			rangeHelper.saveRange();

			pasteContentFragment = globalDoc.createDocumentFragment();
			while (editable.firstChild)
				dom.appendChild(pasteContentFragment, editable.firstChild);

			setTimeout(function ()
			{
				var html = editable.innerHTML;

				editable.innerHTML = '';
				dom.appendChild(editable, pasteContentFragment);
				editable.scrollTop = scrollTop;
				pasteContentFragment = false;

				rangeHelper.restoreRange();

				handlePasteData({ html: html });
			}, 0);
		}
	};

	/**
	 * Gets the pasted data, filters it and then inserts it.
	 *
	 * @param {object} data
	 * @private
	 */
	handlePasteData = function (data)
	{
		var pasteArea = dom.createElement('div', {}, wysiwygDocument);

		base.events.emit('pasteraw', data);

		if (data.html)
		{
			pasteArea.innerHTML = data.html;

			// fix any invalid nesting
			dom.fixNesting(pasteArea);
		}
		else
			pasteArea.innerHTML = escape.entities(data.text || '');

		var paste = {
			val: pasteArea.innerHTML
		};

		if ('fragmentToSource' in format)
			paste.val = format
				.fragmentToSource(paste.val, wysiwygDocument, currentNode);

		base.events.emit('paste', paste);

		if ('fragmentToHtml' in format)
			paste.val = format
				.fragmentToHtml(paste.val, currentNode);

		base.events.emit('pastehtml', paste);

		base.wysiwygEditorInsertHtml(paste.val, null, true);
	};

	/**
	 * Inserts HTML into WYSIWYG editor.
	 *
	 * If endHtml is specified,  any selected text will be placed
	 * between html and endHtml. If there is no selected text html
	 * and endHtml will just be concatenate together.
	 *
	 * @param {string} html
	 * @param {string} [endHtml=null]
	 * @param {boolean} [overrideCodeBlocking=false] If to insert the html
	 *                                               into code tags, by
	 *                                               default code tags only
	 *                                               support text.
	 * @function
	 * @name wysiwygEditorInsertHtml
	 */
	base.wysiwygEditorInsertHtml = function (
		html, endHtml, overrideCodeBlocking
	)
	{
		var	marker, scrollTop, scrollTo,
			editorHeight = dom.height(wysiwygEditor);

		base.focus();

		// TODO: This code tag should be configurable and
		// should maybe convert the HTML into text instead
		// Don't apply to code elements
		if (!overrideCodeBlocking && dom.closest(currentBlockNode, 'code'))
			return;

		// Insert the HTML and save the range so the editor can be scrolled
		// to the end of the selection. Also allows emoticons to be replaced
		// without affecting the cursor position
		rangeHelper.insertHTML(html, endHtml);
		rangeHelper.saveRange();
		base.events.emit('inserthtml', html, endHtml);

		// Scroll the editor after the end of the selection
		marker   = dom.find(wysiwygBody, '#sceditor-end-marker')[0];
		dom.show(marker);
		scrollTop = wysiwygBody.scrollTop;
		scrollTo  = (dom.getOffset(marker).top +
			(marker.offsetHeight * 1.5)) - editorHeight;
		dom.hide(marker);

		// Only scroll if marker isn't already visible
		if (scrollTo > scrollTop || scrollTo + editorHeight < scrollTop)
			wysiwygBody.scrollTop = scrollTo;

		triggerValueChanged(false);
		rangeHelper.restoreRange();

		// Add a new line after the last block element
		// so can always add text after it
		appendNewLine();
	};

	/**
	 * Like wysiwygEditorInsertHtml except it will convert any HTML
	 * into text before inserting it.
	 *
	 * @param {string} text
	 * @param {string} [endText=null]
	 * @function
	 * @name wysiwygEditorInsertText
	 */
	base.wysiwygEditorInsertText = function (text, endText)
	{
		base.wysiwygEditorInsertHtml(
			escape.entities(text), escape.entities(endText)
		);
	};

	/**
	 * Inserts text into the WYSIWYG or source editor depending on which
	 * mode the editor is in.
	 *
	 * If endText is specified any selected text will be placed between
	 * text and endText. If no text is selected text and endText will
	 * just be concatenate together.
	 *
	 * @param {string} text
	 * @param {string} [endText=null]
	 * @since 1.3.5
	 * @function
	 * @name insertText
	 */
	base.insertText = function (text, endText)
	{
		if (base.isInSourceMode())
			base.sourceEditorInsertText(text, endText);
		else
			base.wysiwygEditorInsertText(text, endText);

		return base;
	};

	/**
	 * Like wysiwygEditorInsertHtml but inserts text into the
	 * source mode editor instead.
	 *
	 * If endText is specified any selected text will be placed between
	 * text and endText. If no text is selected text and endText will
	 * just be concatenate together.
	 *
	 * The cursor will be placed after the text param. If endText is
	 * specified the cursor will be placed before endText, so passing:<br />
	 *
	 * '[b]', '[/b]'
	 *
	 * Would cause the cursor to be placed:<br />
	 *
	 * [b]Selected text|[/b]
	 *
	 * @param {string} text
	 * @param {string} [endText=null]
	 * @since 1.4.0
	 * @function
	 * @name sourceEditorInsertText
	 */
	base.sourceEditorInsertText = function (text, endText)
	{
		var scrollTop, currentValue,
			startPos = sourceEditor.selectionStart,
			endPos   = sourceEditor.selectionEnd;

		scrollTop = sourceEditor.scrollTop;
		sourceEditor.focus();
		currentValue = sourceEditor.value;

		if (endText)
			text += currentValue.substring(startPos, endPos) + endText;

		sourceEditor.value = currentValue.substring(0, startPos) +
			text +
			currentValue.substring(endPos, currentValue.length);

		sourceEditor.selectionStart = (startPos + text.length) -
			(endText ? endText.length : 0);
		sourceEditor.selectionEnd = sourceEditor.selectionStart;

		sourceEditor.scrollTop = scrollTop;
		sourceEditor.focus();

		triggerValueChanged();
	};

	/**
	 * Gets the current instance of the rangeHelper class
	 * for the editor.
	 *
	 * @returns {RangeHelper}
	 * @function
	 * @name getRangeHelper
	 */
	base.getRangeHelper = () => rangeHelper;

	/**
	 * Gets or sets the source editor caret position.
	 *
	 * @param {object} [position]
	 * @returns {this}
	 * @function
	 * @since 1.4.5
	 * @name sourceEditorCaret
	 */
	base.sourceEditorCaret = function (position)
	{
		sourceEditor.focus();

		if (position)
		{
			sourceEditor.selectionStart = position.start;
			sourceEditor.selectionEnd = position.end;

			return this;
		}

		return {
			start: sourceEditor.selectionStart,
			end: sourceEditor.selectionEnd
		};
	};

	/**
	 * Inserts HTML/BBCode into the editor
	 *
	 * If end is supplied any selected text will be placed between
	 * start and end. If there is no selected text start and end
	 * will be concatenated together.
	 *
	 * If the filter param is set to true, the HTML/BBCode will be
	 * passed through any plugin filters. If using the BBCode plugin
	 * this will convert any BBCode into HTML.
	 *
	 * If the allowMixed param is set to true, HTML any will not be
	 * escaped
	 *
	 * @param {string} start
	 * @param {string} [end=null]
	 * @param {boolean} [filter=true]
	 * @param {boolean} [allowMixed=false]
	 * @returns {this}
	 * @since 1.4.3
	 * @function
	 * @name insert
	 */
	base.insert = function (start, end, filter, allowMixed)
	{
		if (base.isInSourceMode())
		{
			base.sourceEditorInsertText(start, end);
			return base;
		}

		// Add the selection between start and end
		if (end)
		{
			var	html = rangeHelper.selectedHtml();

			if (filter !== false && 'fragmentToSource' in format)
				html = format
					.fragmentToSource(html, wysiwygDocument, currentNode);

			start += html + end;
		}
		// TODO: This filter should allow empty tags as it's inserting.
		if (filter !== false && 'fragmentToHtml' in format)
			start = format.fragmentToHtml(start, currentNode);

		// Convert any escaped HTML back into HTML if mixed is allowed
		if (filter !== false && allowMixed === true)
			start = start.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&amp;/g, '&');

		base.wysiwygEditorInsertHtml(start);

		return base;
	};

	/**
	 * Gets the WYSIWYG editors HTML value.
	 *
	 * If using a plugin that filters the Ht Ml like the BBCode plugin
	 * it will return the result of the filtering (BBCode) unless the
	 * filter param is set to false.
	 *
	 * @param {boolean} [filter=true]
	 * @returns {string}
	 * @function
	 * @name getWysiwygEditorValue
	 */
	base.getWysiwygEditorValue = function (filter)
	{
		var	html;
		// Create a tmp node to store contents so it can be modified
		// without affecting anything else.
		var tmp = dom.createElement('div', {}, wysiwygDocument);
		var childNodes = wysiwygBody.childNodes;

		for (var i = 0; i < childNodes.length; i++)
			dom.appendChild(tmp, childNodes[i].cloneNode(true));

		dom.appendChild(wysiwygBody, tmp);
		dom.fixNesting(tmp);
		dom.remove(tmp);

		html = tmp.innerHTML;

		// filter the HTML and DOM through any plugins
		if (filter !== false && format.hasOwnProperty('toSource'))
			html = format.toSource(html, wysiwygDocument);

		return html;
	};

	/**
	 * Gets the entire editor's container.
	 *
	 * @returns {HTMLElement}
	 * @function
	 * @since 3.0.0
	 * @name getEditorContainer
	 */
	base.getEditorContainer = () => editorContainer;

	/**
	 * Gets the WYSIWYG editor's iFrame Body.
	 *
	 * @returns {HTMLElement}
	 * @function
	 * @since 1.4.3
	 * @name getBody
	 */
	base.getBody = () => wysiwygBody;

	/**
	 * Gets the WYSIWYG editors container area (whole iFrame).
	 *
	 * @returns {HTMLElement}
	 * @function
	 * @since 1.4.3
	 * @name getContentAreaContainer
	 */
	base.getContentAreaContainer = () => wysiwygEditor;

	/**
	 * Gets the value of the editor.
	 *
	 * If the editor is in WYSIWYG mode it will return the filtered
	 * HTML from it (converted to BBCode if using the BBCode plugin).
	 * It it's in Source Mode it will return the unfiltered contents
	 * of the source editor (if using the BBCode plugin this will be
	 * BBCode again).
	 *
	 * @since 1.3.5
	 * @returns {string}
	 * @function
	 * @name val
	 */
	base.getValue = () => base.isInSourceMode() ?
		sourceEditor.value :
		base.getWysiwygEditorValue();

	/**
	 * Gets the text editor value
	 *
	 * If using a plugin that filters the text like the BBCode plugin
	 * it will return the result of the filtering which is BBCode to
	 * HTML so it will return HTML. If filter is set to false it will
	 * just return the contents of the source editor (BBCode).
	 *
	 * @private
	 * @param {boolean} [filter=true]
	 * @returns {string}
	 * @function
	 * @since 1.4.0
	 * @name getSourceEditorValue
	 */
	base.getSourceEditorValue = function (filter)
	{
		var val = sourceEditor.value;

		if (filter !== false && 'toHtml' in format)
			val = format.toHtml(val);

		return val;
	};

	/**
	 * Sets the WYSIWYG HTML editor value. Should only be the HTML
	 * contained within the body tags
	 *
	 * @param {string} value
	 * @function
	 * @name setValue
	 */
	base.setValue = value => base.isInSourceMode() ?
		base.setSourceEditorValue(value) :
		base.setWysiwygEditorValue(value);

	/**
	 * Sets the WYSIWYG HTML editor value. Should only be the HTML
	 * contained within the body tags
	 *
	 * @param {string} value
	 * @function
	 * @name setWysiwygEditorValue
	 */
	base.setWysiwygEditorValue = function (value)
	{
		if (!value)
			value = '<p>' + (IE_VER ? '' : '<br />') + '</p>';

		wysiwygBody.innerHTML = value;
		base.events.emit('inserthtml', value);

		appendNewLine();
		triggerValueChanged();
		autoExpand();
	};

	/**
	 * Sets the text editor value
	 *
	 * @param {string} value
	 * @function
	 * @name setSourceEditorValue
	 */
	base.setSourceEditorValue = function (value)
	{
		sourceEditor.value = value;

		triggerValueChanged();
	};

	/**
	 * Updates the textarea that the editor is replacing
	 * with the value currently inside the editor.
	 *
	 * @function
	 * @name updateOriginal
	 * @since 1.4.0
	 */
	base.updateOriginal = function ()
	{
		original.value = base.getValue();
	};

	/**
	 * If the editor is in source code mode
	 *
	 * @returns {boolean}
	 * @function
	 * @name isInSourceMode
	 */
	base.isInSourceMode = function ()
	{
		return dom.hasClass(editorContainer, 'sourceMode');
	};

	/**
	 * Switches between the WYSIWYG and source modes
	 *
	 * @function
	 * @name toggleSourceMode
	 * @since 1.4.0
	 */
	base.toggleSourceMode = function ()
	{
		var isInSourceMode = base.isInSourceMode();

		// don't allow switching to WYSIWYG if doesn't support it
		if (!browser.isWysiwygSupported && isInSourceMode)
			return;

		if (!isInSourceMode)
		{
			rangeHelper.saveRange();
			rangeHelper.clear();
		}

		base.blur();

		if (isInSourceMode)
			base.setWysiwygEditorValue(base.getSourceEditorValue());
		else
			base.setSourceEditorValue(base.getWysiwygEditorValue());

		dom.toggle(sourceEditor);
		dom.toggle(wysiwygEditor);

		dom.toggleClass(editorContainer, 'wysiwygMode', isInSourceMode);
		dom.toggleClass(editorContainer, 'sourceMode', !isInSourceMode);

		updateActiveButtons();
	};

	/**
	 * Handles the passed command
	 *
	 * @param cmd
	 * @private
	 */
	handleCommand = function (cmd)
	{
		var isInSourceMode = base.isInSourceMode();
		if (isInSourceMode && cmd.code)
		{
			var code = cmd.code;
			if (code.call)
				code = code.call(
					base,
					sourceEditor.value.substring(
						sourceEditor.selectionStart,
						sourceEditor.selectionEnd
					)
				);
			else
				base.sourceEditorInsertText.apply(base, code);
		}
		if (cmd.exec.call)
			cmd.exec.call(base);
		else if (!isInSourceMode)
			base.execCommand(
				cmd.exec,
				cmd.hasOwnProperty('execParam') ? cmd.execParam : null
			);
	};

	/**
	 * Executes a command on the WYSIWYG editor
	 *
	 * @param {string} command
	 * @param {string | boolean} [param]
	 * @function
	 * @name execCommand
	 */
	base.execCommand = function (command, param)
	{
		var	executed    = false,
			commandObj  = commands[command];

		base.focus();

		// TODO: make configurable
		// don't apply any commands to code elements
		if (dom.closest(rangeHelper.parentNode(), 'code'))
			return;

		try
		{
			executed = wysiwygDocument.execCommand(command, false, param);
		}
		catch (ex)
		{ }

		// show error if execution failed and an error message exists
		if (!executed && commandObj && commandObj.errorMessage)
			/*global alert:false*/
			alert(base._(commandObj.errorMessage));

		updateActiveButtons();
	};

	/**
	 * Checks if the current selection has changed and triggers
	 * the selectionchanged event if it has.
	 *
	 * In browsers other than IE, it will check at most once every 100ms.
	 * This is because only IE has a selection changed event.
	 *
	 * @private
	 */
	checkSelectionChanged = function ()
	{
		/**
		 *
		 */
		function check()
		{
			// Don't create new selection if there isn't one (like after
			// blur event in iOS)
			if (wysiwygWindow.getSelection() &&
				wysiwygWindow.getSelection().rangeCount <= 0)
				currentSelection = null;
			// rangeHelper could be null if editor was destroyed
			// before the timeout had finished
			else if (rangeHelper && !rangeHelper.compare(currentSelection))
			{
				currentSelection = rangeHelper.cloneSelected();

				// If the selection is in an inline wrap it in a block.
				// Fixes #331
				if (currentSelection && currentSelection.collapsed)
				{
					var parent = currentSelection.startContainer;
					var offset = currentSelection.startOffset;

					// Handle if selection is placed before/after an element
					if (offset && parent.nodeType !== dom.TEXT_NODE)
						parent = parent.childNodes[offset];

					while (parent && parent.parentNode !== wysiwygBody)
						parent = parent.parentNode;

					if (parent && dom.isInline(parent, true))
					{
						rangeHelper.saveRange();
						wrapInlines(wysiwygBody, wysiwygDocument);
						rangeHelper.restoreRange();
					}
				}

				base.events.emit('selectionchanged');
			}

			isSelectionCheckPending = false;
		}

		if (isSelectionCheckPending)
			return;

		isSelectionCheckPending = true;

		// Don't need to limit checking if browser supports the Selection API
		if ('onselectionchange' in wysiwygDocument)
			check();
		else
			setTimeout(check, 100);
	};

	/**
	 * Checks if the current node has changed and triggers
	 * the nodechanged event if it has
	 *
	 * @private
	 */
	checkNodeChanged = function ()
	{
		// check if node has changed
		var
			oldNode,
			node = rangeHelper.parentNode();

		if (currentNode !== node)
		{
			oldNode          = currentNode;
			currentNode      = node;
			currentBlockNode = rangeHelper.getFirstBlockParent(node);

			base.events.emit('nodechanged', oldNode, currentNode);
		}
	};

	/**
	 * Gets the current node that contains the selection/caret in
	 * WYSIWYG mode.
	 *
	 * Will be null in sourceMode or if there is no selection.
	 *
	 * @returns {?Node}
	 * @function
	 * @name currentNode
	 */
	base.currentNode = () => currentNode;

	/**
	 * Gets the first block level node that contains the
	 * selection/caret in WYSIWYG mode.
	 *
	 * Will be null in sourceMode or if there is no selection.
	 *
	 * @returns {?Node}
	 * @function
	 * @name currentBlockNode
	 * @since 1.4.4
	 */
	base.currentBlockNode = () => currentBlockNode;

	/**
	 * Updates if buttons are active or not
	 *
	 * @private
	 */
	updateActiveButtons = function ()
	{
		var firstBlock, parent;
		var activeClass = 'active';
		var doc         = wysiwygDocument;
		var isSource    = base.isInSourceMode();

		if (!isSource)
		{
			parent     = rangeHelper.parentNode();
			firstBlock = rangeHelper.getFirstBlockParent(parent);
		}

		for (var j = 0; j < btnStateHandlers.length; j++)
		{
			var state      = 0;
			var btn        = btnStateHandlers[j].button;
			var stateFn    = btnStateHandlers[j].state;

			if (utils.isFunction(stateFn))
				state = stateFn(base, parent, firstBlock);
			else if (utils.isString(stateFn) && !isSource)
				try
				{
					state = doc.queryCommandEnabled(stateFn) ? 0 : -1;

					if (state > -1)
						state = doc.queryCommandState(stateFn) ? 1 : 0;
				}
				catch (ex)
				{}

			dom.toggleClass(btn, 'disabled', state < 0);
			dom.toggleClass(btn, activeClass, state > 0);
		}

		options.icons.update(isSource, parent, firstBlock);
	};

	/**
	 * Handles any key press in the WYSIWYG editor
	 *
	 * @param e
	 * @private
	 */
	handleKeyPress = function (e)
	{
		// FF bug: https://bugzilla.mozilla.org/show_bug.cgi?id=501496
		if (e.defaultPrevented)
			return;

		// 13 = enter key
		if (e.which === 13)
		{
			var LIST_TAGS = 'li,ul,ol';

			// "Fix" (cludge) for blocklevel elements being duplicated in some
			// browsers when enter is pressed instead of inserting a newline
			if (!dom.is(currentBlockNode, LIST_TAGS) &&
				dom.hasStyling(currentBlockNode))
			{
				var br = dom.createElement('br', {}, wysiwygDocument);
				rangeHelper.insertNode(br);

				// Last <br> of a block will be collapsed unless it is
				// IE < 11 so need to make sure the <br> that was inserted
				// isn't the last node of a block.
				if (!IE_BR_FIX)
				{
					var parent  = br.parentNode;
					var lastChild = parent.lastChild;

					// Sometimes an empty next node is created after the <br>
					if (lastChild && lastChild.nodeType === dom.TEXT_NODE &&
						lastChild.nodeValue === '')
					{
						dom.remove(lastChild);
						lastChild = parent.lastChild;
					}

					// If this is the last BR of a block and the previous
					// sibling is inline then will need an extra BR. This
					// is needed because the last BR of a block will be
					// collapsed. Fixes issue #248
					if (!dom.isInline(parent, true) && lastChild === br &&
						dom.isInline(br.previousSibling))
						rangeHelper.insertHTML('<br>');
				}

				stopEvent(e);
			}
		}
	};

	/**
	 * Makes sure that if there is a code or quote tag at the
	 * end of the editor, that there is a new line after it.
	 *
	 * If there wasn't a new line at the end you wouldn't be able
	 * to enter any text after a code/quote tag
	 *
	 * @returns {void}
	 * @private
	 */
	appendNewLine = function ()
	{
		// Check all nodes in reverse until either add a new line
		// or reach a non-empty textnode or BR at which point can
		// stop checking.
		dom.rTraverse(wysiwygBody, function (node)
		{
			// Last block, add new line after if has styling
			if (node.nodeType === dom.ELEMENT_NODE &&
				!/inline/.test(dom.css(node, 'display')))

				// Add line break after if has styling
				if (!dom.is(node, '.sceditor-nlf') && dom.hasStyling(node))
				{
					var paragraph = dom.createElement('p', {}, wysiwygDocument);
					paragraph.className = 'sceditor-nlf';
					paragraph.innerHTML = !IE_BR_FIX ? '<br />' : '';
					dom.appendChild(wysiwygBody, paragraph);
					return false;
				}

			// Last non-empty text node or line break.
			// No need to add line-break after them
			if ((node.nodeType === 3 && !/^\s*$/.test(node.nodeValue)) ||
				dom.is(node, 'br'))
				return false;
		});
	};

	/**
	 * Translates the string into the locale language.
	 *
	 * Replaces any {0}, {1}, {2}, ect. with the params provided.
	 *
	 * @param {string} str
	 * @param {...string} args
	 * @returns {string}
	 * @function
	 * @name _
	 */
	base._ = (str, ...args) => utils.format(locale[str] || str, ...args);

	/**
	 * Blurs the editors input area
	 *
	 * @returns {this}
	 * @function
	 * @name blur
	 * @since 1.3.6
	 */
	base.blur = function ()
	{
		if (!base.isInSourceMode())
			wysiwygBody.blur();
		else
			sourceEditor.blur();

		return base;
	};

	/**
	 * Focuses the editors input area
	 *
	 * @returns {this}
	 * @function
	 * @name focus
	 */
	base.focus = function ()
	{
		if (!base.isInSourceMode())
		{
			// Already has focus so do nothing
			if (dom.find(wysiwygDocument, ':focus').length)
				return;

			var container;
			var rng = rangeHelper.selectedRange();

			// Fix FF bug where it shows the cursor in the wrong place
			// if the editor hasn't had focus before. See issue #393
			if (!currentSelection)
				autofocus();

			// Check if cursor is set after a BR when the BR is the only
			// child of the parent. In Firefox this causes a line break
			// to occur when something is typed. See issue #321
			if (!IE_BR_FIX && rng && rng.endOffset === 1 && rng.collapsed)
			{
				container = rng.endContainer;

				if (container && container.childNodes.length === 1 &&
					dom.is(container.firstChild, 'br'))
				{
					rng.setStartBefore(container.firstChild);
					rng.collapse(true);
					rangeHelper.selectRange(rng);
				}
			}

			wysiwygWindow.focus();
			wysiwygBody.focus();
		}
		else
			sourceEditor.focus();

		updateActiveButtons();

		return base;
	};

	/**
	 * Gets the current WYSIWYG editors inline CSS
	 *
	 * @returns {string}
	 * @function
	 * @name css
	 * @since 1.4.3
	 */
	/**
	 * Sets inline CSS for the WYSIWYG editor
	 *
	 * @param {string} css
	 * @returns {this}
	 * @function
	 * @name css^2
	 * @since 1.4.3
	 */
	base.css = function (css)
	{
		if (!inlineCss)
		{
			inlineCss = dom.createElement('style', {
				id: 'inline'
			}, wysiwygDocument);

			dom.appendChild(wysiwygDocument.head, inlineCss);
		}

		if (!utils.isString(css))
			return inlineCss.styleSheet ?
				inlineCss.styleSheet.cssText : inlineCss.innerHTML;

		if (inlineCss.styleSheet)
			inlineCss.styleSheet.cssText = css;
		else
			inlineCss.innerHTML = css;

		return base;
	};

	/**
	 * Handles the keydown event, used for shortcuts
	 *
	 * @param e
	 * @private
	 */
	handleKeyDown = function (e)
	{
		var	shortcut   = [],
			SHIFT_KEYS = {
				'`': '~',
				'1': '!',
				'2': '@',
				'3': '#',
				'4': '$',
				'5': '%',
				'6': '^',
				'7': '&',
				'8': '*',
				'9': '(',
				'0': ')',
				'-': '_',
				'=': '+',
				';': ': ',
				'\'': '"',
				',': '<',
				'.': '>',
				'/': '?',
				'\\': '|',
				'[': '{',
				']': '}'
			},
			SPECIAL_KEYS = {
				8: 'backspace',
				9: 'tab',
				13: 'enter',
				19: 'pause',
				20: 'capslock',
				27: 'esc',
				32: 'space',
				33: 'pageup',
				34: 'pagedown',
				35: 'end',
				36: 'home',
				37: 'left',
				38: 'up',
				39: 'right',
				40: 'down',
				45: 'insert',
				46: 'del',
				91: 'win',
				92: 'win',
				93: 'select',
				96: '0',
				97: '1',
				98: '2',
				99: '3',
				100: '4',
				101: '5',
				102: '6',
				103: '7',
				104: '8',
				105: '9',
				106: '*',
				107: '+',
				109: '-',
				110: '.',
				111: '/',
				112: 'f1',
				113: 'f2',
				114: 'f3',
				115: 'f4',
				116: 'f5',
				117: 'f6',
				118: 'f7',
				119: 'f8',
				120: 'f9',
				121: 'f10',
				122: 'f11',
				123: 'f12',
				144: 'numlock',
				145: 'scrolllock',
				186: ';',
				187: '=',
				188: ',',
				189: '-',
				190: '.',
				191: '/',
				192: '`',
				219: '[',
				220: '\\',
				221: ']',
				222: '\''
			},
			NUMPAD_SHIFT_KEYS = {
				109: '-',
				110: 'del',
				111: '/',
				96: '0',
				97: '1',
				98: '2',
				99: '3',
				100: '4',
				101: '5',
				102: '6',
				103: '7',
				104: '8',
				105: '9'
			},
			which     = e.which,
			character = SPECIAL_KEYS[which] ||
				String.fromCharCode(which).toLowerCase();

		if (e.ctrlKey || e.metaKey)
			shortcut.push('ctrl');

		if (e.altKey)
			shortcut.push('alt');

		if (e.shiftKey)
		{
			shortcut.push('shift');

			if (NUMPAD_SHIFT_KEYS[which])
				character = NUMPAD_SHIFT_KEYS[which];
			else if (SHIFT_KEYS[character])
				character = SHIFT_KEYS[character];

		}

		// Shift is 16, ctrl is 17 and alt is 18
		if (character && (which < 16 || which > 18))
			shortcut.push(character);

		shortcut = shortcut.join('+');
		if (shortcutHandlers[shortcut] &&
			shortcutHandlers[shortcut].call(base) === false)
		{
			e.stopPropagation();
			stopEvent(e);
		}
	};

	/**
	 * Adds a shortcut handler to the editor
	 *
	 * @param  {string}          shortcut
	 * @param  {string | Function} cmd
	 * @returns {sceditor}
	 */
	base.addShortcut = function (shortcut, cmd)
	{
		shortcut = shortcut.toLowerCase();

		if (utils.isString(cmd))
			shortcutHandlers[shortcut] = function ()
			{
				handleCommand(commands[cmd]);

				return false;
			};
		else
			shortcutHandlers[shortcut] = cmd;

		return base;
	};

	/**
	 * Removes a shortcut handler
	 *
	 * @param  {string} shortcut
	 * @returns {sceditor}
	 */
	base.removeShortcut = function (shortcut)
	{
		delete shortcutHandlers[shortcut.toLowerCase()];

		return base;
	};

	/**
	 * Handles the backspace key press
	 *
	 * Will remove block styling like quotes/code ect if at the start.
	 *
	 * @param e
	 * @private
	 */
	handleBackSpace = function (e)
	{
		var	node, offset, range, parent;

		// 8 is the backspace key
		if (options.disableBlockRemove || e.which !== 8 ||
			!(range = rangeHelper.selectedRange()))
			return;

		node   = range.startContainer;
		offset = range.startOffset;

		if (offset !== 0 || !(parent = currentStyledBlockNode()) ||
			dom.is(parent, 'body'))
			return;

		while (node !== parent)
		{
			while (node.previousSibling)
			{
				node = node.previousSibling;

				// Everything but empty text nodes before the cursor
				// should prevent the style from being removed
				if (node.nodeType !== dom.TEXT_NODE || node.nodeValue)
					return;
			}

			if (!(node = node.parentNode))
				return;
		}

		// The backspace was pressed at the start of
		// the container so clear the style
		base.clearBlockFormatting(parent);
		stopEvent(e);
	};

	/**
	 * Gets the first styled block node that contains the cursor
	 *
	 * @returns {HTMLElement}
	 */
	currentStyledBlockNode = function ()
	{
		var block = currentBlockNode;

		while (!dom.hasStyling(block) || dom.isInline(block, true))
			if (!(block = block.parentNode) || dom.is(block, 'body'))
				return;

		return block;
	};

	/**
	 * Clears the formatting of the passed block element.
	 *
	 * If block is false, if will clear the styling of the first
	 * block level element that contains the cursor.
	 *
	 * @param  {HTMLElement} block
	 * @since 1.4.4
	 */
	base.clearBlockFormatting = function (block)
	{
		block = block || currentStyledBlockNode();

		if (!block || dom.is(block, 'body'))
			return base;

		rangeHelper.saveRange();

		block.className = '';

		dom.attr(block, 'style', '');

		if (!dom.is(block, 'p,div,td'))
			dom.convertElement(block, 'p');

		rangeHelper.restoreRange();
		return base;
	};

	/**
	 * Triggers the valueChanged signal if there is
	 * a plugin that handles it.
	 *
	 * If rangeHelper.saveRange() has already been
	 * called, then saveRange should be set to false
	 * to prevent the range being saved twice.
	 *
	 * @since 1.4.5
	 * @param {boolean} saveRange If to call rangeHelper.saveRange().
	 * @private
	 */
	triggerValueChanged = function (saveRange)
	{
		if (!eventHandlers.valuechanged)
			return;

		var
			currentHtml,
			sourceMode   = base.isInSourceMode(),
			hasSelection = !sourceMode && rangeHelper.hasSelection();

		// Composition end isn't guaranteed to fire but must have
		// ended when triggerValueChanged() is called so reset it
		isComposing = false;

		// Don't need to save the range if sceditor-start-marker
		// is present as the range is already saved
		saveRange = saveRange !== false &&
			!wysiwygDocument.getElementById('sceditor-start-marker');

		// Clear any current timeout as it's now been triggered
		if (valueChangedKeyUpTimer)
		{
			clearTimeout(valueChangedKeyUpTimer);
			valueChangedKeyUpTimer = false;
		}

		if (hasSelection && saveRange)
			rangeHelper.saveRange();

		currentHtml = sourceMode ? sourceEditor.value : wysiwygBody.innerHTML;

		// Only trigger if something has actually changed.
		if (currentHtml !== lastVal)
		{
			lastVal = currentHtml;

			base.events.emit('valuechanged', currentHtml);
		}

		if (hasSelection && saveRange)
			rangeHelper.removeMarkers();
	};

	/**
	 * Should be called whenever there is a blur event
	 *
	 * @private
	 */
	valueChangedBlur = function ()
	{
		if (valueChangedKeyUpTimer)
			triggerValueChanged();
	};

	/**
	 * Should be called whenever there is a keypress event
	 *
	 * @param  {Event} e The keypress event
	 * @private
	 */
	valueChangedKeyUp = function (e)
	{
		var which         = e.which,
			lastChar      = valueChangedKeyUp.lastChar,
			lastWasSpace  = (lastChar === 13 || lastChar === 32),
			lastWasDelete = (lastChar === 8 || lastChar === 46);

		valueChangedKeyUp.lastChar = which;

		if (isComposing)
			return;

		switch (which)
		{
		// 13 = return
			case 13:
				// 32 = space
			case 32:
				if (!lastWasSpace)
					triggerValueChanged();
				else
					valueChangedKeyUp.triggerNext = true;
				break;
			case 8:
				// 8 = backspace
			case 46:
				// 46 = del
				if (!lastWasDelete)
					triggerValueChanged();
				else
					valueChangedKeyUp.triggerNext = true;
				break;
		}
		if (valueChangedKeyUp.triggerNext)
		{
			triggerValueChanged();
			valueChangedKeyUp.triggerNext = false;
		}

		// Clear the previous timeout and set a new one.
		clearTimeout(valueChangedKeyUpTimer);

		// Trigger the event 1.5s after the last keypress if space
		// isn't pressed. This might need to be lowered, will need
		// to look into what the slowest average Chars Per Min is.
		valueChangedKeyUpTimer = setTimeout(function ()
		{
			if (!isComposing)
				triggerValueChanged();

		}, 1500);
	};

	handleComposition = function (e)
	{
		isComposing = /start/i.test(e.type);

		if (!isComposing)
			triggerValueChanged();
	};

	// run the initializer
	init();

	base.command =
	{
		/**
		 * Gets a command
		 *
		 * @param {string} name
		 * @returns {object | null}
		 * @since v1.3.5
		 */
		get(name)
		{
			return defaultCommands[name] || null;
		},

		/**
		 * <p>Adds a command to the editor or updates an existing
		 * command if a command with the specified name already exists.</p>
		 *
		 * <p>Once a command is add it can be included in the toolbar by
		 * adding it's name to the toolbar option in the constructor. It
		 * can also be executed manually by calling
		 * {@link sceditor.execCommand}</p>
		 *
		 * @example
		 * SCEditor.command.set("hello",
		 * {
		 *     exec() {
		 *         alert("Hello World!");
		 *     }
		 * });
		 *
		 * @param {string} name
		 * @param {object} cmd
		 * @returns {this|false} Returns false if name or cmd is false
		 * @since v1.3.5
		 */
		set(name, cmd)
		{
			if (!name || !cmd)
				return false;

			// merge any existing command properties
			cmd = utils.extend(defaultCommands[name] || {}, cmd);

			defaultCommands[name] = cmd;
			return this;
		},

		/**
		 * Removes a command
		 *
		 * @param {string} name
		 * @returns {this}
		 * @since v1.3.5
		 */
		remove(name)
		{
			if (defaultCommands[name])
				delete defaultCommands[name];

			return this;
		}
	};
};
