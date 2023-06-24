package kafkaschemas

import (
	"encoding/json"
	"fmt"
	"time"

	msgpack "github.com/vmihailenco/msgpack/v5"
)

type EventLevel uint8

const (
	EventLevelDebug EventLevel = iota
	EventLevelInfo
	EventLevelWarning
	EventLevelError
	EventLevelFatal
)

type Event struct {
	Timestamp time.Time      `json:"timestamp" msgpack:"timestamp"`
	Message   string         `json:"message" msgpack:"message"`
	Level     EventLevel     `json:"level" msgpack:"level"`
	Extras    map[string]any `json:"extras" msgpack:"extras"`
}

func (e Event) MarshalJson() ([]byte, error) {
	return json.Marshal(e)
}

func (e Event) MarshalMsgPack() ([]byte, error) {
	return msgpack.Marshal(e)
}

func ParseEvent(b []byte) (event Event, err error) {
	err = msgpack.Unmarshal(b, &event)
	if err != nil {
		// try json
		e := json.Unmarshal(b, &event)
		if e != nil {
			return Event{}, fmt.Errorf("unmarshaling: %w, %s", e, err.Error())
		}

		if e == nil {
			return event, nil
		}

		return event, err
	}

	return event, nil
}
