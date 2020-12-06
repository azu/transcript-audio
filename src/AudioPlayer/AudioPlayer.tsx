import React, { useCallback, useEffect, useState } from "react";
import { AudioTranscript } from "./AudioTranscript";
import { AudioWave } from "./AudioWave";

const setBlackholeInput = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices().then(function (devices) {
        return devices.filter((device) => device.kind === "audioinput");
    });
    console.log("Input devices", devices);
    const device = devices[2];
    if (!device) {
        console.log("No device");
        return;
    }
    const inputDevideId = device.deviceId;
    console.log("inputDevideId", inputDevideId);
    const constraints = {
        audio: {
            deviceId: inputDevideId
        }
    };
    await navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        // 成功した時の処理
        console.log("SUCCC", stream);
    });
};

const toHHMMSS = (totalSeconds?: number): string => {
    if (!totalSeconds) {
        return "<Unknown>:<Unknown>";
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds % 60);

    return [hours, minutes, seconds]
        .map((v) => (v < 10 ? "0" + v : v))
        .filter((v, i) => v !== "00" || i > 0)
        .join(":");
};

const useAudio = () => {
    const [audioElement, setAudioElement] = useState<HTMLAudioElement>();
    const audioRef = useCallback((node) => {
        if (node !== null) {
            setAudioElement(node);
        }
    }, []);
    return [audioElement, audioRef] as const;
};

export function AudioPlayer() {
    const [audioElement, audioRef] = useAudio();
    const [playing, setPlaying] = useState<boolean>(false);
    const [speechingText, setSpeechingText] = useState("");
    const [speechingLogs, setSpeechingLogs] = useState<string[]>([]);
    const addLog = useCallback(
        (log: string) => {
            setSpeechingLogs(speechingLogs.concat(log));
        },
        [speechingLogs]
    );
    useEffect(() => {
        (async () => {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioDevices = devices.filter((device) => device.kind === "audiooutput");
            const audio = audioElement;
            if (!audio) {
                return;
            }
            const outputAudioDevice = audioDevices[3];
            console.log("outputAudioDevice", outputAudioDevice);
            const outputDeviceId = outputAudioDevice.deviceId;
            await (audio as any).setSinkId(outputDeviceId);
        })();
    }, [audioElement]);
    useEffect(() => {
        (async () => {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioDevices = devices.filter((device) => device.kind === "audiooutput");
            const audio = audioElement;
            console.log("audio", audio);
            if (!audio) {
                return;
            }
            const outputAudioDevice = audioDevices[3];
            console.log("outputAudioDevice", outputAudioDevice);
            const outputDeviceId = outputAudioDevice.deviceId;
            await (audio as any).setSinkId(outputDeviceId);
        })();
    }, [audioElement]);
    useEffect(() => {
        let recognition: SpeechRecognition;
        let state: "play" | "pause" = "pause";
        const startRecognition = () => {
            if (state === "play") {
                return;
            }
            state = "play";
            const SpeechRecognition =
                window.SpeechRecognition || ((window as any).webkitSpeechRecognition as SpeechRecognition);
            recognition = new SpeechRecognition();
            recognition.interimResults = true;
            recognition.continuous = true;
            recognition.lang = "ja";
            recognition.onresult = function (event) {
                const currentTime = audioElement?.currentTime;
                console.log("current time", currentTime);
                const speechRecognitionResults = Array.from(event.results);
                console.log("speechRecognitionResults", speechRecognitionResults);
                const finalResult = speechRecognitionResults.find((result) => result.isFinal);
                setSpeechingText(speechRecognitionResults.map((result) => result[0].transcript).join("↩\n"));
                if (finalResult) {
                    addLog(`${toHHMMSS(currentTime)}${finalResult[0].transcript}`);
                }
            };
            recognition.onend = function (_event) {
                console.log("onend");
                if (playing) {
                    startRecognition();
                }
            };
            recognition.onstart = function (_event) {
                console.log("onstart");
            };
            recognition.onerror = function (_event) {
                console.log("onerror");
                // reject(event);
            };
            recognition.start();
            console.log("init");
        };
        const stopRecognition = () => {
            recognition?.stop();
            state = "pause";
        };
        if (playing) {
            startRecognition();
        }
        return () => {
            stopRecognition();
        };
    }, [playing, audioElement, addLog]);
    const onPlay = () => {
        setPlaying(true);
        setBlackholeInput().catch((error) => console.error(error));
    };
    const onStop = () => {
        setPlaying(false);
    };
    return (
        <div
            className={"AudioPlayer"}
            style={{
                width: "100%"
            }}
        >
            <audio
                src={"debug.m4a"}
                autoPlay={playing}
                controls={true}
                onPlay={onPlay}
                onPause={onStop}
                ref={audioRef}
            />
            <AudioWave audioElement={audioElement} />
            <AudioTranscript speechingText={speechingText} logs={speechingLogs} />
        </div>
    );
}
