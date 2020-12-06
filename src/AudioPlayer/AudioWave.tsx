import React, { useCallback, useEffect, useState } from "react";
// @ts-ignore
import WFPlayer from "wfplayer";

export function AudioWave(props: { audioElement: HTMLAudioElement | undefined }) {
    const [waveform, setWaveform] = useState();
    const waveRef = useCallback((node) => {
        setWaveform(node);
    }, []);
    useEffect(() => {
        console.log("useEffect");
        if (!props.audioElement || !waveform) {
            return;
        }
        console.log("waveform", waveform);
        const wp = new WFPlayer({
            container: waveform
        });
        wp.load(props.audioElement);
        return () => {};
    }, [waveform, props.audioElement]);

    return (
        <div
            style={{
                width: "1000px",
                height: "300px"
            }}
            ref={waveRef}
        />
    );
}
