import test from 'ava';
import sinon from 'sinon';
import PluginManager from '../../../src/lib/PluginManager.js';

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

test.serial('exists()', function (assert)
{
	assert.true(pluginManager.exists(fakePlugin));
});

test.serial('isRegistered()', function (assert)
{
	pluginManager.register(fakePlugin);

	assert.true(pluginManager.isRegistered(fakePlugin));
	assert.false(pluginManager.isRegistered(fakePluginTwo));
});

test.serial('register() - Call init', function (assert)
{
	fakePlugin.prototype.init = sinon.spy();
	fakePluginTwo.prototype.init = sinon.spy();

	assert.true(pluginManager.register(fakePlugin));

	assert.true(fakePlugin.prototype.init.calledOnce);
	assert.true(fakePlugin.prototype.init.calledOn(fakeEditor));
	assert.false(fakePluginTwo.prototype.init.called);
});

test.serial('register() - Called twice', function (assert)
{
	fakePlugin.prototype.init = sinon.spy();

	assert.true(pluginManager.register(fakePlugin));
	assert.false(pluginManager.register(fakePlugin));

	assert.true(fakePlugin.prototype.init.calledOnce);
	assert.true(fakePlugin.prototype.init.calledOn(fakeEditor));
});

test.serial('deregister()', function (assert)
{
	fakePlugin.prototype.destroy = sinon.spy();
	fakePluginTwo.prototype.destroy = sinon.spy();

	pluginManager.register(fakePlugin);
	pluginManager.register(fakePluginTwo);

	pluginManager.deregister(fakePlugin);

	assert.true(fakePlugin.prototype.destroy.calledOnce);
	assert.true(fakePlugin.prototype.destroy.calledOn(fakeEditor));
	assert.false(fakePluginTwo.prototype.destroy.calledOnce);
});

test.serial('deregister() - Called twice', function (assert)
{
	fakePlugin.prototype.destroy = sinon.spy();
	fakePluginTwo.prototype.destroy = sinon.spy();

	pluginManager.register(fakePlugin);
	pluginManager.register(fakePluginTwo);

	pluginManager.deregister(fakePlugin);
	pluginManager.deregister(fakePlugin);

	assert.true(fakePlugin.prototype.destroy.calledOnce);
	assert.true(fakePlugin.prototype.destroy.calledOn(fakeEditor));
	assert.false(fakePluginTwo.prototype.destroy.calledOnce);
});

test.serial('destroy()', function (assert)
{
	fakePlugin.prototype.destroy = sinon.spy();
	fakePluginTwo.prototype.destroy = sinon.spy();

	pluginManager.register(fakePlugin);
	pluginManager.register(fakePluginTwo);

	pluginManager.destroy();

	assert.true(fakePlugin.prototype.destroy.calledOnce);
	assert.true(fakePlugin.prototype.destroy.calledOn(fakeEditor));
	assert.true(fakePluginTwo.prototype.destroy.calledOnce);
	assert.true(fakePluginTwo.prototype.destroy.calledOn(fakeEditor));
});
