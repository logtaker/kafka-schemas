/// <reference types="node" />
export declare enum EventLevel {
    DEBUG = 0,
    INFO = 1,
    WARNING = 2,
    ERROR = 3,
    FATAL = 4
}
export type Event = {
    timestamp: Date;
    message: string;
    level: EventLevel;
    extras: Record<string, any>;
    toJSON: () => string;
    toMsgpack: () => Uint8Array;
};
export declare function newEvent(event: Omit<Event, "toJSON" | "toMsgpack">): Event;
export declare function parseEvent(input: string | Buffer): Event;
