import { attr } from './dom.js';

/**
 * Default options for SCEditor
 * @type {Object}
 */
export default {
	/** @lends jQuery.sceditor.defaultOptions */
	/**
	 * Toolbar buttons order and groups. Should be comma separated and
	 * have a bar | to separate groups
	 *
	 * @type {string}
	 */
	toolbar: 'bold,italic,underline,strike,subscript,superscript|' +
		'left,center,right,justify|font,size,color,removeformat|' +
		'cut,copy,pastetext|bulletlist,orderedlist,indent,outdent|' +
		'table|code,quote|horizontalrule,image,email,link,unlink|' +
		'emoticon,youtube,date,time|ltr,rtl|print,maximize,source',

	/**
	 * Comma separated list of commands to excludes from the toolbar
	 *
	 * @type {string}
	 */
	toolbarExclude: null,

	/**
	 * Stylesheet to include in the WYSIWYG editor. This is what will style
	 * the WYSIWYG elements
	 *
	 * @type {string}
	 */
	style: 'jquery.sceditor.default.css',

	/**
	 * Comma separated list of fonts for the font selector
	 *
	 * @type {string}
	 */
	fonts: 'Arial,Arial Black,Comic Sans MS,Courier New,Georgia,Impact,' +
		'Sans-serif,Serif,Times New Roman,Trebuchet MS,Verdana',

	/**
	 * Colors should be an array of objects where keys are the color
	 * (as recognised by CSS) and values are the friendly names
	 * that show in the tooltips.
	 *
	 * Each object in the array represents a column of color swatches.
	 *
	 * Names geenerated from http://chir.ag/projects/name-that-color/
	 *
	 * @type {Object[]}
	 */
	colors:
[
	{
		'#630000': 'Rosewood',
		'#9C0000': 'Sangria',
		'#CE0000': 'Guardsman Red',
		'#E76363': 'Mandy',
		'#E79C9C': 'Tonys Pink',
		'#F7C6CE': 'Azalea',
		'#FF0000': 'Red',
		'#000000': 'Black'
	},
	{
		'#7B3900': 'Cinnamon',
		'#B56308': 'Mai Tai',
		'#E79439': 'Fire Bush',
		'#F7AD6B': 'Rajah',
		'#FFC69C': 'Peach Orange',
		'#FFE7CE': 'Karry',
		'#FF9C00': 'Orange Peel',
		'#424242': 'Tundora'
	},
	{
		'#846300': 'Olive',
		'#BD9400': 'Buddha Gold',
		'#EFC631': 'Golden Dream',
		'#FFD663': 'Dandelion',
		'#FFE79C': 'Cream Brulee',
		'#FFEFC6': 'Egg White',
		'#FFFF00': 'Yellow',
		'#636363': 'Dove Gray'
	},
	{
		'#295218': 'Parsley',
		'#397B21': 'Forest Green',
		'#6BA54A': 'Chelsea Cucumber',
		'#94BD7B': 'Olivine',
		'#B5D6A5': 'Sprout',
		'#D6EFD6': 'Zanah',
		'#00FF00': 'Green',
		'#9C9C94': 'Star Dust'
	},
	{
		'#083139': 'Tiber',
		'#104A5A': 'Eden',
		'#4A7B8C': 'Smalt Blue',
		'#73A5AD': 'Gulf Stream',
		'#A5C6CE': 'Casper',
		'#CEDEE7': 'Botticelli',
		'#00FFFF': 'Cyan',
		'#CEC6CE': 'Pale Slate'
	},
	{
		'#003163': 'Midnight Blue',
		'#085294': 'Venice Blue',
		'#3984C6': 'Boston Blue',
		'#6BADDE': 'Viking',
		'#9CC6EF': 'Perano',
		'#CEE7F7': 'Tropical Blue',
		'#0000FF': 'Blue',
		'#EFEFEF': 'Gallery'
	},
	{
		'#21104A': 'Valentino',
		'#311873': 'Meteorite',
		'#634AA5': 'Butterfly Bush',
		'#8C7BC6': 'Blue Marguerite',
		'#B5A5D6': 'Cold Purple',
		'#D6D6E7': 'Mischka',
		'#9C00FF': 'Electric Violet',
		'#F7F7F7': 'Alabaster'
	},
	{
		'#4A1031': 'Loulou',
		'#731842': 'Claret',
		'#A54A7B': 'Cadillac',
		'#C67BA5': 'Puce',
		'#D6A5BD': 'Careys Pink',
		'#E7D6DE': 'Twilight',
		'#FF00FF': 'Magenta',
		'#FFFFFF': 'White'
	}
],

	/**
	 * The locale to use.
	 * @type {string}
	 */
	locale: attr(document.documentElement, 'lang') || 'en',

	/**
	 * The Charset to use
	 * @type {string}
	 */
	charset: 'utf-8',

	/**
	 * Compatibility mode for emoticons.
	 *
	 * Helps if you have emoticons such as :/ which would put an emoticon
	 * inside http://
	 *
	 * This mode requires emoticons to be surrounded by whitespace or end of
	 * line chars. This mode has limited As You Type emoticon conversion
	 * support. It will not replace AYT for end of line chars, only
	 * emoticons surrounded by whitespace. They will still be replaced
	 * correctly when loaded just not AYT.
	 *
	 * @type {boolean}
	 */
	emoticonsCompat: false,

	/**
	 * If to enable emoticons. Can be changes at runtime using the
	 * emoticons() method.
	 *
	 * @type {boolean}
	 * @since 1.4.2
	 */
	emoticonsEnabled: true,

	/**
	 * Emoticon root URL
	 *
	 * @type {string}
	 */
	emoticonsRoot: '',
	emoticons: {
		dropdown: {
			':)': 'emoticons/smile.png',
			':angel:': 'emoticons/angel.png',
			':angry:': 'emoticons/angry.png',
			'8-)': 'emoticons/cool.png',
			':\'(': 'emoticons/cwy.png',
			':ermm:': 'emoticons/ermm.png',
			':D': 'emoticons/grin.png',
			'<3': 'emoticons/heart.png',
			':(': 'emoticons/sad.png',
			':O': 'emoticons/shocked.png',
			':P': 'emoticons/tongue.png',
			';)': 'emoticons/wink.png'
		},
		more: {
			':alien:': 'emoticons/alien.png',
			':blink:': 'emoticons/blink.png',
			':blush:': 'emoticons/blush.png',
			':cheerful:': 'emoticons/cheerful.png',
			':devil:': 'emoticons/devil.png',
			':dizzy:': 'emoticons/dizzy.png',
			':getlost:': 'emoticons/getlost.png',
			':happy:': 'emoticons/happy.png',
			':kissing:': 'emoticons/kissing.png',
			':ninja:': 'emoticons/ninja.png',
			':pinch:': 'emoticons/pinch.png',
			':pouty:': 'emoticons/pouty.png',
			':sick:': 'emoticons/sick.png',
			':sideways:': 'emoticons/sideways.png',
			':silly:': 'emoticons/silly.png',
			':sleeping:': 'emoticons/sleeping.png',
			':unsure:': 'emoticons/unsure.png',
			':woot:': 'emoticons/w00t.png',
			':wassat:': 'emoticons/wassat.png'
		},
		hidden: {
			':whistling:': 'emoticons/whistling.png',
			':love:': 'emoticons/wub.png'
		}
	},

	/**
	 * Width of the editor. Set to null for automatic with
	 *
	 * @type {?number}
	 */
	width: null,

	/**
	 * Height of the editor including toolbar. Set to null for automatic
	 * height
	 *
	 * @type {?number}
	 */
	height: null,

	/**
	 * If to allow the editor to be resized
	 *
	 * @type {boolean}
	 */
	resizeEnabled: true,

	/**
	 * Min resize to width, set to null for half textarea width or -1 for
	 * unlimited
	 *
	 * @type {?number}
	 */
	resizeMinWidth: null,
	/**
	 * Min resize to height, set to null for half textarea height or -1 for
	 * unlimited
	 *
	 * @type {?number}
	 */
	resizeMinHeight: null,
	/**
	 * Max resize to height, set to null for double textarea height or -1
	 * for unlimited
	 *
	 * @type {?number}
	 */
	resizeMaxHeight: null,
	/**
	 * Max resize to width, set to null for double textarea width or -1 for
	 * unlimited
	 *
	 * @type {?number}
	 */
	resizeMaxWidth: null,
	/**
	 * If resizing by height is enabled
	 *
	 * @type {boolean}
	 */
	resizeHeight: true,
	/**
	 * If resizing by width is enabled
	 *
	 * @type {boolean}
	 */
	resizeWidth: true,

	/**
	 * Date format, will be overridden if locale specifies one.
	 *
	 * The words year, month and day will be replaced with the users current
	 * year, month and day.
	 *
	 * @type {string}
	 */
	dateFormat: 'year-month-day',

	/**
	 * Element to inset the toolbar into.
	 *
	 * @type {HTMLElement}
	 */
	toolbarContainer: null,

	/**
	 * If to enable paste filtering. This is currently experimental, please
	 * report any issues.
	 *
	 * @type {boolean}
	 */
	enablePasteFiltering: false,

	/**
	 * If to completely disable pasting into the editor
	 *
	 * @type {boolean}
	 */
	disablePasting: false,

	/**
	 * If the editor is read only.
	 *
	 * @type {boolean}
	 */
	readOnly: false,

	/**
	 * If to set the editor to right-to-left mode.
	 *
	 * If set to null the direction will be automatically detected.
	 *
	 * @type {boolean}
	 */
	rtl: false,

	/**
	 * If to auto focus the editor on page load
	 *
	 * @type {boolean}
	 */
	autofocus: false,

	/**
	 * If to auto focus the editor to the end of the content
	 *
	 * @type {boolean}
	 */
	autofocusEnd: true,

	/**
	 * If to auto expand the editor to fix the content
	 *
	 * @type {boolean}
	 */
	autoExpand: false,

	/**
	 * If to auto update original textbox on blur
	 *
	 * @type {boolean}
	 */
	autoUpdate: false,

	/**
	 * If to enable the browsers built in spell checker
	 *
	 * @type {boolean}
	 */
	spellcheck: true,

	/**
	 * If to run the source editor when there is no WYSIWYG support. Only
	 * really applies to mobile OS's.
	 *
	 * @type {boolean}
	 */
	runWithoutWysiwygSupport: false,

	/**
	 * If to load the editor in source mode and still allow switching
	 * between WYSIWYG and source mode
	 *
	 * @type {boolean}
	 */
	startInSourceMode: false,

	/**
	 * Optional ID to give the editor.
	 *
	 * @type {string}
	 */
	id: null,

	/**
	 * Array of plugins
	 *
	 * @type {string[]}
	 */
	plugins: [],

	/**
	 * z-index to set the editor container to. Needed for jQuery UI dialog.
	 *
	 * @type {?number}
	 */
	zIndex: null,

	/**
	 * If to trim the BBCode. Removes any spaces at the start and end of the
	 * BBCode string.
	 *
	 * @type {boolean}
	 */
	bbcodeTrim: false,

	/**
	 * If to disable removing block level elements by pressing backspace at
	 * the start of them
	 *
	 * @type {boolean}
	 */
	disableBlockRemove: false,

	/**
	 * BBCode parser options, only applies if using the editor in BBCode
	 * mode.
	 *
	 * See SCEditor.BBCodeParser.defaults for list of valid options
	 *
	 * @type {Object}
	 */
	parserOptions: {
		/**
		* Parameters that will be added to YouTube frame tag
		*
		* @type {string}
		*/
		youtubeParameters: 'width="560" height="315" frameborder="0" ' +
			'allowfullscreen',

		/**
			* Parameters that will be added to Facebook frame tag
			*
			* @type {string}
			*/
		facebookParameters: 'width="560" height="315" ' +
			'style="border:none;overflow:hidden" scrolling="no" ' +
			'frameborder="0" allowTransparency="true" allowFullScreen="true"'
	},

	/**
	 * CSS that will be added to the to dropdown menu (eg. z-index)
	 *
	 * @type {Object}
	 */
	dropDownCss: {}
};
