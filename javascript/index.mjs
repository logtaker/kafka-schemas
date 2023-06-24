import { encode, decode } from '@msgpack/msgpack';

var EventLevel;
(function (EventLevel) {
    EventLevel[EventLevel["DEBUG"] = 0] = "DEBUG";
    EventLevel[EventLevel["INFO"] = 1] = "INFO";
    EventLevel[EventLevel["WARNING"] = 2] = "WARNING";
    EventLevel[EventLevel["ERROR"] = 3] = "ERROR";
    EventLevel[EventLevel["FATAL"] = 4] = "FATAL";
})(EventLevel || (EventLevel = {}));
function newEvent(event) {
    return Object.assign(Object.assign({}, event), { toJSON: function () { return JSON.stringify({ timestamp: this.timestamp.toISOString(), message: this.message, level: this.level, extras: this.extras }); }, toMsgpack: function () { return encode({ timestamp: this.timestamp.toISOString(), message: this.message, level: this.level, extras: this.extras }); } });
}
function parseEvent(input) {
    let decoded;
    if (typeof input === "string") {
        // Can't parse string with msgpack
        decoded = JSON.parse(input);
    }
    else {
        try {
            decoded = decode(input);
        }
        catch (error) {
            if (error instanceof RangeError) {
                // Try to parse with JSON
                decoded = JSON.parse(input.toString("utf-8"));
                return validateEvent(decoded);
            }
            // Re-throw error
            throw error;
        }
    }
    return validateEvent(decoded);
}
function validateEvent(input) {
    let event = {
        extras: {},
        level: EventLevel.DEBUG,
        message: "",
        timestamp: new Date(),
        toJSON: function () { return JSON.stringify({ timestamp: this.timestamp.toISOString(), message: this.message, level: this.level, extras: this.extras }); },
        toMsgpack: function () { return encode({ timestamp: this.timestamp.toISOString(), message: this.message, level: this.level, extras: this.extras }); }
    };
    if (typeof input === "object" && !Array.isArray(input) && input != null) {
        if ("level" in input) {
            const level = input.level;
            let parsedLevel = EventLevel.DEBUG;
            if (typeof level === "number") {
                switch (level) {
                    case 0:
                        parsedLevel = EventLevel.DEBUG;
                        break;
                    case 1:
                        parsedLevel = EventLevel.INFO;
                        break;
                    case 2:
                        parsedLevel = EventLevel.WARNING;
                        break;
                    case 3:
                        parsedLevel = EventLevel.ERROR;
                        break;
                    case 4:
                        parsedLevel = EventLevel.FATAL;
                        break;
                    default:
                        parsedLevel = EventLevel.DEBUG;
                }
            }
            event.level = parsedLevel;
        }
        if ("message" in input) {
            if (typeof input.message === "string") {
                event.message = input.message;
            }
        }
        if ("extras" in input) {
            if (typeof input.extras === "object" && input.extras != null) {
                event.extras = input.extras;
            }
        }
        if ("timestamp" in input) {
            if (typeof input.timestamp === "string") {
                event.timestamp = new Date(input.timestamp);
            }
            else if (typeof input.timestamp === "number") {
                event.timestamp = new Date(input.timestamp);
            }
        }
        return event;
    }
    else {
        throw new TypeError("expecting parameter of type object");
    }
}

export { EventLevel, newEvent, parseEvent };
//# sourceMappingURL=index.mjs.map
