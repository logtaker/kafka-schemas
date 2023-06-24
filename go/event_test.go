package kafkaschemas_test

import (
	"testing"
	"time"

	kafkaschemas "github.com/logtaker/kafka-schemas/go"
)

func TestEvent(t *testing.T) {
	t.Run("Parse JSON event", func(t *testing.T) {
		body := []byte(`{
	"message": "Hello world",
	"timestamp": "2020-02-01T21:10:23Z",
	"level": 3,
	"extras": {
		"contextKey": "registration",
		"music": "Rihanna"
	}
}`)
		event, err := kafkaschemas.ParseEvent(body)
		if err != nil {
			t.Errorf("unexpected error: %s", err.Error())
		}

		if event.Message != "Hello world" {
			t.Errorf("expecting event.Message to be 'Hello world' instead got %s", event.Message)
		}
	})

	t.Run("Marshal JSON", func(t *testing.T) {
		event := kafkaschemas.Event{
			Timestamp: time.Date(2019, 3, 12, 10, 30, 12, 0, time.UTC),
			Message:   "Lorem ipsum dolor sit amet!",
			Level:     kafkaschemas.EventLevelWarning,
			Extras: map[string]any{
				"contextKey":   "chi",
				"contextValue": "horn",
			},
		}

		out, err := event.MarshalJson()
		if err != nil {
			t.Errorf("unexpected error: %s", err.Error())
		}

		expected := `{"timestamp":"2019-03-12T10:30:12Z","message":"Lorem ipsum dolor sit amet!","level":2,"extras":{"contextKey":"chi","contextValue":"horn"}}`

		if string(out) != expected {
			t.Errorf("expecting out to be %q, got %q", string(expected), string(out))
		}
	})

	t.Run("Marshal Msgpack", func(t *testing.T) {
		event := kafkaschemas.Event{
			Timestamp: time.Date(2019, 3, 12, 10, 30, 12, 0, time.UTC),
			Message:   "Lorem ipsum dolor sit amet!",
			Level:     kafkaschemas.EventLevelWarning,
			Extras: map[string]any{
				"contextKey":   "chi",
				"contextValue": "horn",
			},
		}

		out, err := event.MarshalMsgPack()
		if err != nil {
			t.Errorf("unexpected error: %s", err.Error())
		}

		expected := `\x84\xa9timestamp\xd6\xff\\\x87\x8a4\xa7message\xbbLorem ipsum dolor sit amet!\xa5level\xcc\x02\xa6extras\x82\xaacontextKey\xa3chi\xaccontextValue\xa4horn`
		if string(out) != expected {
			t.Errorf("expecting out to be %q, got %q", string(expected), string(out))
		}
	})
}
