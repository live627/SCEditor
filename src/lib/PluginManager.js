/**
 * Plugin Manager class
 *
 * @param thisObj
 * @class PluginManager
 * @name PluginManager
 */
export default function PluginManager(thisObj)
{
	var
		/**
		 * Array of all currently registered plugins
		 *
		 * @type {Array}
		 * @private
		 */
		registeredPlugins = [],

		/**
		 * Checks if the plugin exists in plugins
		 *
		 * @param  {string} plugin
		 * @returns {boolean}
		 * @function
		 * @name exists
		 * @memberOf PluginManager.prototype
		 */
		exists = plugin => typeof plugin === 'function' &&
					typeof plugin.prototype === 'object',

		/**
		 * Checks if the passed plugin is currently registered.
		 *
		 * @param  {string} plugin
		 * @returns {boolean}
		 * @function
		 * @name isRegistered
		 * @memberOf PluginManager.prototype
		 */
		isRegistered = plugin =>
		{
			if (exists(plugin))
			{
				var idx = registeredPlugins.length;

				while (idx--)
					if (registeredPlugins[idx] instanceof plugin)
						return true;
			}

			return false;
		},

		/**
		 * Registers a plugin to receive signals
		 *
		 * @param  {string} plugin
		 * @returns {boolean}
		 * @function
		 * @name register
		 * @memberOf PluginManager.prototype
		 */
		register = plugin =>
		{
			if (!exists(plugin) || isRegistered(plugin))
				return false;

			var Plugin = plugin;
			plugin = new Plugin;
			registeredPlugins.push(plugin);

			if ('init' in plugin)
				plugin.init.call(thisObj);

			return true;
		},

		/**
		 * Deregisters a plugin.
		 *
		 * @param  {string} plugin
		 * @returns {boolean}
		 * @function
		 * @name deregister
		 * @memberOf PluginManager.prototype
		 */
		deregister = plugin =>
		{
			var	removedPlugin,
				pluginIdx = registeredPlugins.length,
				removed   = false;

			if (!isRegistered(plugin))
				return removed;

			while (pluginIdx--)
				if (registeredPlugins[pluginIdx] instanceof plugin)
				{
					removedPlugin = registeredPlugins.splice(pluginIdx, 1)[0];
					removed       = true;

					if ('destroy' in removedPlugin)
						removedPlugin.destroy.call(thisObj);
				}

			return removed;
		},

		/**
		 * Clears all plugins and removes the owner reference.
		 *
		 * Calling any functions on this object after calling
		 * destroy will cause a JS error.
		 *
		 * @name destroy
		 * @memberOf PluginManager.prototype
		 */
		destroy = () =>
		{
			var i = registeredPlugins.length;

			while (i--)
				if ('destroy' in registeredPlugins[i])
					registeredPlugins[i].destroy.call(thisObj);

			registeredPlugins = [];
			thisObj    = null;
		};

	return {
		exists,
		isRegistered,
		register,
		deregister,
		destroy
	};
};
