export default class EventEmitter {
    constructor() {
        this._eventList = {};
    }  

    on(eventName, callback) {
        if (!eventName) return this;

        if (!this._eventList[eventName]) {
            this._eventList[eventName] = [];
        }
        this._eventList[eventName].push(callback);

        return this;
    }

    emit(eventName, ...args) {
        let eventList = this._eventList[eventName];

        if (!eventList || !eventList.length) return this;

        eventList.forEach(handler => handler.apply(null, args))

        return this;
    }

    remove(eventName, callback) {
        if (!eventName) return this;

        let eventList = this._eventList[eventName];
        if (!callback && eventList) {
            this._eventList[eventName] = [];
            return this;
        }

        for (let i = 0; i < eventList.length; i++) {
            if (eventList[i] === callback) {
                eventList.splice(i, 1);
                break;
            }
        }

        return this;
    }

    removeAll() {
        this._eventList = {};
        return this;
    }

    once(eventName, callback) {
        let handler = (...args) => {
            callback.apply(null, args);
            this.remove(eventName, handler);
        };

        return this.on(eventName, handler);
    }
}