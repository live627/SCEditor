import test from 'ava';
import sinon from 'sinon';
import PluginManager from '../src/lib/PluginManager.js';

var fakeEditor = {};
var fakePlugin;
var fakePluginTwo;
var pluginManager;

test.beforeEach(() =>
{
	fakePlugin    = function ()
	{};
	fakePluginTwo = function ()
	{};

	pluginManager = new PluginManager(fakeEditor);
});

test.serial('exists()',t =>
{
	t.true(pluginManager.exists(fakePlugin));
});

test.serial('isRegistered()',t =>
{
	pluginManager.register(fakePlugin);

	t.true(pluginManager.isRegistered(fakePlugin));
	t.false(pluginManager.isRegistered(fakePluginTwo));
});

test.serial('register() - Call init',t =>
{
	fakePlugin.prototype.init = sinon.spy();
	fakePluginTwo.prototype.init = sinon.spy();

	t.true(pluginManager.register(fakePlugin));

	t.true(fakePlugin.prototype.init.calledOnce);
	t.true(fakePlugin.prototype.init.calledOn(fakeEditor));
	t.false(fakePluginTwo.prototype.init.called);
});

test.serial('register() - Called twice',t =>
{
	fakePlugin.prototype.init = sinon.spy();

	t.true(pluginManager.register(fakePlugin));
	t.false(pluginManager.register(fakePlugin));

	t.true(fakePlugin.prototype.init.calledOnce);
	t.true(fakePlugin.prototype.init.calledOn(fakeEditor));
});

test.serial('deregister()',t =>
{
	fakePlugin.prototype.destroy = sinon.spy();
	fakePluginTwo.prototype.destroy = sinon.spy();

	pluginManager.register(fakePlugin);
	pluginManager.register(fakePluginTwo);

	pluginManager.deregister(fakePlugin);

	t.true(fakePlugin.prototype.destroy.calledOnce);
	t.true(fakePlugin.prototype.destroy.calledOn(fakeEditor));
	t.false(fakePluginTwo.prototype.destroy.calledOnce);
});

test.serial('deregister() - Called twice',t =>
{
	fakePlugin.prototype.destroy = sinon.spy();
	fakePluginTwo.prototype.destroy = sinon.spy();

	pluginManager.register(fakePlugin);
	pluginManager.register(fakePluginTwo);

	pluginManager.deregister(fakePlugin);
	pluginManager.deregister(fakePlugin);

	t.true(fakePlugin.prototype.destroy.calledOnce);
	t.true(fakePlugin.prototype.destroy.calledOn(fakeEditor));
	t.false(fakePluginTwo.prototype.destroy.calledOnce);
});

test.serial('destroy()',t =>
{
	fakePlugin.prototype.destroy = sinon.spy();
	fakePluginTwo.prototype.destroy = sinon.spy();

	pluginManager.register(fakePlugin);
	pluginManager.register(fakePluginTwo);

	pluginManager.destroy();

	t.true(fakePlugin.prototype.destroy.calledOnce);
	t.true(fakePlugin.prototype.destroy.calledOn(fakeEditor));
	t.true(fakePluginTwo.prototype.destroy.calledOnce);
	t.true(fakePluginTwo.prototype.destroy.calledOn(fakeEditor));
});
