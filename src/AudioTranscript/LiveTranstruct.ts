export type LiveTranscript = { text: string; currentTime: number };
export type IRTranscript = {
    startIndex: number;
    endIndex: number;
    startTime: number;
    endTime: number;
};
export type createLiveTranscriptResultItem = {
    startIndex: number;
    endIndex: number;
    text: string;
    startTime: number;
    endTime: number;
};
export type createLiveTranscriptResult = {
    text: string;
    items: createLiveTranscriptResultItem[];
};
export const createLiveTranscript = (startTime: number = 0) => {
    let rawTranscripts: LiveTranscript[] = [];
    let internalTranscripts: IRTranscript[] = [];
    return {
        valid(transcript: LiveTranscript) {
            const lastTranscript = rawTranscripts[rawTranscripts.length - 1];
            if (!lastTranscript) {
                return true;
            }
            // if text length is lower than previous, it is invalid
            return transcript.text.length > lastTranscript.text.length;
        },
        add(transcript: LiveTranscript) {
            if (!this.valid(transcript)) {
                return;
            }
            rawTranscripts.push(transcript);
            const lastIR = internalTranscripts[internalTranscripts.length - 1];
            if (lastIR) {
                internalTranscripts.push({
                    startIndex: lastIR.endIndex,
                    endIndex: transcript.text.length,
                    startTime: lastIR.endTime + 1,
                    endTime: transcript.currentTime
                });
            } else {
                // first IR
                internalTranscripts.push({
                    startIndex: 0,
                    endIndex: transcript.text.length,
                    startTime: startTime,
                    endTime: transcript.currentTime
                });
            }
        },
        get(): createLiveTranscriptResult {
            const lastTranscript = rawTranscripts[rawTranscripts.length - 1];
            if (!lastTranscript) {
                return {
                    text: "",
                    items: []
                };
            }
            return {
                text: lastTranscript.text,
                items: internalTranscripts.map((ir) => {
                    return {
                        ...ir,
                        text: lastTranscript.text.slice(ir.startIndex, ir.endIndex)
                    };
                })
            };
        },
        clear() {
            rawTranscripts = [];
            internalTranscripts = [];
        },
        setStartTime(newStartTime: number) {
            startTime = newStartTime;
        }
    };
};
