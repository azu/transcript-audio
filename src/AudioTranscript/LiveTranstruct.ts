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
export const createLiveTranscript = () => {
    const rawTranscript: LiveTranscript[] = [];
    const internalTranscript: IRTranscript[] = [];
    return {
        valid(transcript: LiveTranscript) {
            const lastTranscript = rawTranscript[rawTranscript.length - 1];
            if (!lastTranscript) {
                return true;
            }
            // less text by previous
            if (transcript.text.length <= lastTranscript.text.length) {
                return false;
            }
            return true;
        },
        add(transcript: LiveTranscript) {
            if (!this.valid(transcript)) {
                return;
            }
            rawTranscript.push(transcript);
            const lastIR = internalTranscript[internalTranscript.length - 1];
            if (lastIR) {
                internalTranscript.push({
                    startIndex: lastIR.endIndex,
                    endIndex: transcript.text.length,
                    startTime: lastIR.endTime + 1,
                    endTime: transcript.currentTime
                });
            } else {
                // first IR
                internalTranscript.push({
                    startIndex: 0,
                    endIndex: transcript.text.length,
                    startTime: 0,
                    endTime: transcript.currentTime
                });
            }
        },
        get(): createLiveTranscriptResult {
            const lastTranscript = rawTranscript[rawTranscript.length - 1];
            if (!lastTranscript) {
                return {
                    text: "",
                    items: []
                };
            }
            return {
                text: lastTranscript.text,
                items: internalTranscript.map((ir) => {
                    return {
                        ...ir,
                        text: lastTranscript.text.slice(ir.startIndex, ir.endIndex)
                    };
                })
            };
        }
    };
};
