import { createLiveTranscriptResult } from "../AudioTranscript/LiveTranstruct";
import { toHHMMSS } from "./format-time";
import { ReactEventHandler } from "react";

export type AudioTranscriptPropos = {
    onClickLog: (log: createLiveTranscriptResult) => void;
    speechingText: JSX.Element;
    logs: createLiveTranscriptResult[];
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
        return (
            <p key={index}>
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
                <span role={"button"} key={index}>{`${toHHMMSS(log.items[0].startTime)} --> ${toHHMMSS(
                    log.items[log.items.length - 1].endTime
                )}
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
            <p>{props.speechingText}</p>
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
