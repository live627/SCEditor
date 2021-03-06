var plugin = function ()
{
	var base = this;
	var editor;
	var charChangedCount = 0;
	var previousValue;

	var undoLimit  = 50;
	var redoStates = [];
	var undoStates = [];
	var ignoreNext = false;

	/**
	 * Sets the editor to the specified state.
	 *
	 * @param  {object} state
	 * @private
	 */
	var applyState = function (state)
	{
		ignoreNext = true;

		previousValue = state.value;

		editor.sourceMode(state.sourceMode);
		editor.val(state.value, false);
		editor.focus();

		if (state.sourceMode)
			editor.sourceEditorCaret(state.caret);
		else
			editor.getRangeHelper().restoreRange();

		ignoreNext = false;
	};

	/**
	 * Calculates the number of characters that have changed
	 * between two strings.
	 *
	 * @param {string} strA
	 * @param {string} strB
	 * @returns {string}
	 * @private
	 */
	var simpleDiff = function (strA, strB)
	{
		var start, end, aLenDiff, bLenDiff,
			aLength = strA.length,
			bLength = strB.length,
			length  = Math.max(aLength, bLength);

		// Calculate the start
		for (start = 0; start < length; start++)
			if (strA.charAt(start) !== strB.charAt(start))
				break;

		// Calculate the end
		aLenDiff = aLength < bLength ? bLength - aLength : 0;
		bLenDiff = bLength < aLength ? aLength - bLength : 0;

		for (end = length - 1; end >= 0; end--)
			if (strA.charAt(end - aLenDiff) !==
						strB.charAt(end - bLenDiff))
				break;

		return (end - start) + 1;
	};

	base.init = function ()
	{
		// The this variable will be set to the instance of the editor
		// calling it, hence why the plugins "this" is saved to the base
		// variable.
		editor = this;

		undoLimit = editor.undoLimit || undoLimit;

		// addShortcut is the easiest way to add handlers to specific
		// shortcuts
		editor.addShortcut('ctrl+z', base.undo);
		editor.addShortcut('ctrl+shift+z', base.redo);
		editor.addShortcut('ctrl+y', base.redo);
	};

	base.undo = function ()
	{
		var state = undoStates.pop();
		var rawEditorValue = editor.val(null, false);

		if (state && !redoStates.length && rawEditorValue === state.value)
			state = undoStates.pop();

		if (state)
		{
			if (!redoStates.length)
				redoStates.push({
					'caret': editor.sourceEditorCaret(),
					'sourceMode': editor.sourceMode(),
					'value': rawEditorValue
				});

			redoStates.push(state);
			applyState(state);
		}

		return false;
	};

	base.redo = function ()
	{
		var state = redoStates.pop();

		if (!undoStates.length)
		{
			undoStates.push(state);
			state = redoStates.pop();
		}

		if (state)
		{
			undoStates.push(state);
			applyState(state);
		}

		return false;
	};

	window.addEventListener('load', () =>
	{
		var rawValue = editor.val(null, false);

		// Store the initial value as the last value
		previousValue = rawValue;

		undoStates.push({
			'caret': this.sourceEditorCaret(),
			'sourceMode': this.sourceMode(),
			'value': rawValue
		});
	});

	/**
	 * Handle the valueChanged signal.
	 *
	 * rawValue will either be the raw HTML from the WYSIWYG editor with
	 * the rangeHelper range markers inserted, or it will be the raw value
	 * of the source editor (BBCode or HTML depending on plugins).
	 */
	editor.events.on('valuechanged', rawValue =>
	{
		if (undoLimit > 0 && undoStates.length > undoLimit)
			undoStates.shift();

		// If the editor hasn't fully loaded yet,
		// then the previous value won't be set.
		if (ignoreNext || !previousValue || previousValue === rawValue)
			return;

		// Value has changed so remove all redo states
		redoStates.length = 0;
		charChangedCount += simpleDiff(previousValue, rawValue);

		if (charChangedCount < 20)
			return;
		else if (charChangedCount < 50 && !/\s$/g.test(rawValue))
			return;

		undoStates.push({
			'caret': editor.sourceEditorCaret(),
			'sourceMode': editor.sourceMode(),
			'value': rawValue
		});

		charChangedCount = 0;
		previousValue = rawValue;
	});
};

export default plugin;
