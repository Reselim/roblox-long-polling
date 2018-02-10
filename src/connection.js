const REQUEST_VALITDITY_TIME = 55 * 1000; // 60s for game servers, none for studio (always assumes gameserver)

const EventEmitter = require("events");

const { performance } = require("perf_hooks");
const uuid = require("uuid");

class Connection extends EventEmitter {
	constructor() {
		super();

		this.id = uuid();
		this._queue = [];
	}

	send(target, data) {
		this._queue.push({ t: target, d: data });
		this._emptyQueue();
	}

	// Recieve logic

	_emptyQueue(force) {
		if (force || this._req && this._queue.length > 0 && performance.now() - this._last <= REQUEST_VALITDITY_TIME) {
			this._res.status(200).send(this._queue);

			this._req = null;
			this._res = null;

			this._queue.splice(0, this._queue.length);

			clearTimeout(this._timeout);
		}
	}

	onRequest(req, res) {
		this._req = req;
		this._res = res;

		this._last = performance.now();
		this._timeout = setTimeout(() => {
			if (this._res == res) {
				this._emptyQueue(true);
			}
		}, REQUEST_VALITDITY_TIME);

		this._emptyQueue();
	}
}

module.exports = Connection;
