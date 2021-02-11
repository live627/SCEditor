/**
 * Options:
 *
 * pastetext.addButton - If to replace the plaintext button with a toggle
 *                       button that enables and disables plain text mode.
 *
 * pastetext.enabled - If the plain text button should be enabled at start
 *                     up. Only applies if addButton is enabled.
 */
var plugin = function ()
{
	var plainTextEnabled = true;
	var extend = sceditor.utils.extend;

	this.init = function ()
	{
		var commands = this.commands;
		var opts = this.opts;

		if (opts && opts.plaintext && opts.plaintext.addButton)
		{
			plainTextEnabled = opts.plaintext.enabled;

			commands.pastetext = extend(commands.pastetext || {}, {
				state: function ()
				{
					return plainTextEnabled ? 1 : 0;
				},
				exec: function ()
				{
					plainTextEnabled = !plainTextEnabled;
				}
			});
		}

		this.events.on('pasteraw', function (data)
		{
			if (plainTextEnabled)
			{
				if (data.html && !data.text)
				{
					var div = document.createElement('div');
					div.innerHTML = data.html;
					data.text = div.innerText;
				}

				data.html = null;
			}
		});
	};
};

export default plugin;
