export function AudioTranscript(props: { speechingText: JSX.Element; logs: string[] }) {
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
                {props.logs.join("\n")}
            </pre>
        </div>
    );
}
