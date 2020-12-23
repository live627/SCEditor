/**
 * Detects the version of IE is being used if any.
 *
 * Will be the IE version number or undefined if the
 * browser is not IE.
 *
 * Source: https://gist.github.com/527683 with extra code
 * for IE 10 & 11 detection.
 *
 * @function
 * @name ie
 * @type {number}
 */
export var ie = function () {
	var	undef,
		v   = 3,
		doc = document,
		div = doc.createElement('div'),
		all = div.getElementsByTagName('i');

	do {
		div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
	} while (all[0]);

	// Detect IE 10 as it doesn't support conditional comments.
	if ((doc.documentMode && doc.all && window.atob)) {
		v = 10;
	}

	// Detect IE 11
	if (v === 4 && doc.documentMode) {
		v = 11;
	}

	return v > 4 ? v : undef;
};
