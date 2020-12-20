import { createLiveTranscriptResult } from "../AudioTranscript/LiveTranstruct";
import { toHHMMSS } from "./format-time";
import { ReactEventHandler } from "react";

export type AudioTranscriptPropos = {
    onClickLog: (log: createLiveTranscriptResult) => void;
    speechingText: JSX.Element;
    logs: createLiveTranscriptResult[];
    currentTime: number;
};

export function AudioTranscript(props: AudioTranscriptPropos) {
    const onClick: ReactEventHandler<HTMLSpanElement> = (e) => {
        const index = e.currentTarget.getAttribute("data-index");
        if (index === null) {
            return;
        }
        props.onClickLog(props.logs?.[Number(index)]);
    };
    const output = props.logs.map((log, index) => {
        const startTime = log.items[0].startTime;
        const endTime = log.items[log.items.length - 1].endTime;
        const isActiveLog = startTime <= props.currentTime && props.currentTime < endTime;
        return (
            <p
                key={index}
                style={{
                    ...(isActiveLog
                        ? {
                              backgroundColor: `var("--nc-ac-1")`
                          }
                        : {})
                }}
            >
                <button
                    data-index={index}
                    onClick={onClick}
                    style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        outline: "none",
                        padding: "0.5em",
                        appearance: "none"
                    }}
                >
                    🔈
                </button>
                <span role={"button"} key={index}>{`${toHHMMSS(startTime)} --> ${toHHMMSS(endTime)}
${log.text}`}</span>
            </p>
        );
    });
    return (
        <div
            className={"AudioTranscript"}
            style={{
                width: "100%"
            }}
        >
            <h3>Transcript 🔉</h3>
            <p>{props.speechingText}</p>
            <h3>Logs 📝</h3>
            <pre
                style={{
                    whiteSpace: "pre-wrap"
                }}
            >
                {output}
            </pre>
        </div>
    );
}
