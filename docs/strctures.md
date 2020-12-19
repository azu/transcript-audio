##  SpeechRecognitionResult Data Structure

- SpeechRecognitionResult[]
    - SpeechRecognitionResult: A B C
    - SpeechRecognitionResult: D E C...
    
We want to  https://cloud.google.com/speech-to-text/docs/async-time-offsets like format from SpeechRecognitionResult.

```json
{
    "transcript": "okay so what am I doing here...(etc)...",
    "confidence": 0.96596134,
    "words": [
      {
        "startTime": "1.400s",
        "endTime": "1.800s",
        "word": "okay"
      },
      {
        "startTime": "1.800s",
        "endTime": "2.300s",
        "word": "so"
      },
      {
        "startTime": "2.300s",
        "endTime": "2.400s",
        "word": "what"
      },
      {
        "startTime": "2.400s",
        "endTime": "2.600s",
        "word": "am"
      },
      {
        "startTime": "2.600s",
        "endTime": "2.600s",
        "word": "I"
      },
      {
        "startTime": "2.600s",
        "endTime": "2.700s",
        "word": "doing"
      },
      {
        "startTime": "2.700s",
        "endTime": "3s",
        "word": "here"
      },
      {
        "startTime": "3s",
        "endTime": "3.300s",
        "word": "why"
      },
      {
        "startTime": "3.300s",
        "endTime": "3.400s",
        "word": "am"
      },
      {
        "startTime": "3.400s",
        "endTime": "3.500s",
        "word": "I"
      },
      {
        "startTime": "3.500s",
        "endTime": "3.500s",
        "word": "here"
      },
      ...
    ]
}
```
