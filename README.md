# Socket sender:

```
{"type":"start","payload":{"query":"\nsubscription Attributes($fullNames: [String]!) {\n  attributes(fullNames: $fullNames) {\n    device\n    attribute\n    value\n    writeValue\n    timestamp\n  }\n}","variables":{"fullNames":["sys/tg_test/1/double_scalar"]}}}
```

# Socket reciver:

```
{"type": "data", "payload": {"data": {"attributes": {"device": "sys/tg_test/1", "attribute": "double_scalar", "value": 181.01969624669448, "writeValue": 0.0, "timestamp": 1568211918.50133}}}}
```


