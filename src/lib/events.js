// Borrowed & tweaked from ai/nanoevents
// https://github.com/ai/nanoevents/blob/master/index.js

var object = function ()
{
	var events = {};
	return {
		events: events,
		emit(event, ...args)
		{
			for (let i of events[event] || [])
				i(...args);
		},
		on(event, cb)
		{
			(events[event] = events[event] || []).push(cb);
			return () =>
				(events[event] = events[event].filter((i) => i !== cb));
		}
	};
};
export default object;
