import "./AudioPlayer.css";
import React, { HTMLAttributes, ReactEventHandler, useCallback, useEffect, useState } from "react";
import { AudioTranscript } from "./AudioTranscript";
import { createLiveTranscript, createLiveTranscriptResult } from "../AudioTranscript/LiveTranstruct";
import { toHHMMSS } from "./format-time";
import { useDropzone } from "react-dropzone";

const setLoopbackAudioDevice = async (device: MediaDeviceInfo) => {
    const loopbackAudioDeviceId = device.deviceId;
    const constraints = {
        audio: {
            deviceId: loopbackAudioDeviceId
        }
    };
    await navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        console.log("Set Loopback Audio", stream);
    });
};

function useInputAudioDevices() {
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    useEffect(() => {
        navigator.mediaDevices
            .enumerateDevices()
            .then(function (devices) {
                return devices.filter((device) => device.kind === "audioinput");
            })
            .then((devices) => {
                setAudioDevices(devices);
            });
    }, []);
    return [audioDevices];
}

function useOutputAudioDevices() {
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    useEffect(() => {
        navigator.mediaDevices
            .enumerateDevices()
            .then(function (devices) {
                return devices.filter((device) => device.kind === "audiooutput");
            })
            .then((devices) => {
                setAudioDevices(devices);
            });
    }, []);
    return [audioDevices];
}

function SelectAudioDevice(
    props: { audioElement?: HTMLAudioElement; defaultDeviceNames: string[] } & HTMLAttributes<HTMLDivElement>
) {
    const [inputAudioDevices] = useInputAudioDevices();
    const [outputAudioDevices] = useOutputAudioDevices();
    const [inputAudioDeviceId, setInputAudioDeviceId] = useState<string | undefined>(undefined);
    const [outputAudioDeviceId, setOutputAudioDeviceId] = useState<string | undefined>(undefined);
    const onChangeInput: ReactEventHandler<HTMLSelectElement> = useCallback(
        (event) => {
            const deviceId = event.currentTarget.value;
            const selectedDevice = inputAudioDevices.find((device) => device.deviceId === deviceId);
            if (selectedDevice) {
                setInputAudioDeviceId(deviceId);
            }
        },
        [inputAudioDevices]
    );
    const onChangeOutput: ReactEventHandler<HTMLSelectElement> = useCallback(
        (event) => {
            const deviceId = event.currentTarget.value;
            const selectedDevice = outputAudioDevices.find((device) => device.deviceId === deviceId);
            if (selectedDevice) {
                setOutputAudioDeviceId(deviceId);
            }
        },
        [outputAudioDevices]
    );
    useEffect(() => {
        (async () => {
            const matchInputAudioDevice = inputAudioDevices.find((device) => {
                return device.deviceId === inputAudioDeviceId;
            });
            if (!matchInputAudioDevice) {
                return;
            }
            setLoopbackAudioDevice(matchInputAudioDevice).catch((error) => {
                console.error(error);
            });
        })();
    }, [inputAudioDeviceId, inputAudioDevices]);
    useEffect(() => {
        (async () => {
            const audio = props.audioElement;
            if (!audio || !outputAudioDeviceId) {
                return;
            }
            console.log("set outputAudioDevice", outputAudioDeviceId);
            await (audio as any).setSinkId(outputAudioDeviceId);
        })();
    }, [outputAudioDeviceId, props.audioElement]);
    // Default
    useEffect(() => {
        const matchAudioDeviceInfo = (audioDevices: MediaDeviceInfo[]) => {
            return audioDevices.find((device) => {
                return props.defaultDeviceNames.some((name) => {
                    return device.label.toLowerCase().includes(name.toLowerCase());
                });
            });
        };
        const inputAudioDevice = matchAudioDeviceInfo(inputAudioDevices);
        const outputAudioDevice = matchAudioDeviceInfo(outputAudioDevices);
        if (inputAudioDevice) {
            setInputAudioDeviceId(inputAudioDevice.deviceId);
        }
        if (outputAudioDevice) {
            setOutputAudioDeviceId(outputAudioDevice.deviceId);
        }
    }, [inputAudioDevices, outputAudioDevices, props.defaultDeviceNames]);

    return (
        <div
            className={props.className}
            style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "right"
            }}
        >
            <label>
                Input:
                <select value={inputAudioDeviceId} onChange={onChangeInput}>
                    {inputAudioDevices.map((device) => {
                        return (
                            <option key={device.deviceId} value={device.deviceId}>
                                {device.label}
                            </option>
                        );
                    })}
                </select>
            </label>
            <label>
                Output:
                <select value={outputAudioDeviceId} onChange={onChangeOutput}>
                    {outputAudioDevices.map((device) => {
                        return (
                            <option key={device.deviceId} value={device.deviceId}>
                                {device.label}
                            </option>
                        );
                    })}
                </select>
            </label>
        </div>
    );
}

const useAudio = () => {
    const [audioElement, setAudioElement] = useState<HTMLAudioElement>();
    const audioRef = useCallback((node) => {
        if (node !== null) {
            setAudioElement(node);
        }
    }, []);
    return [audioElement, audioRef] as const;
};

const virtualAudioDeviceNames = ["BlackHole"];

export function AudioPlayer() {
    const [audioElement, audioRef] = useAudio();
    const [playing, setPlaying] = useState<boolean>(false);
    const [speechingText, setSpeechingText] = useState<JSX.Element>(<></>);
    const [speechingLogs, setSpeechingLogs] = useState<createLiveTranscriptResult[]>([]);
    const addLog = useCallback(
        (result: createLiveTranscriptResult) => {
            console.log("addLog", result);
            setSpeechingLogs(speechingLogs.concat(result));
        },
        [speechingLogs]
    );
    useEffect(() => {
        let recognition: SpeechRecognition;
        let state: "play" | "pause" = "pause";
        const startRecognition = () => {
            if (state === "play") {
                return;
            }
            state = "play";
            const liveTranscript = createLiveTranscript();
            const SpeechRecognition =
                window.SpeechRecognition || ((window as any).webkitSpeechRecognition as SpeechRecognition);
            recognition = new SpeechRecognition();
            recognition.interimResults = true;
            recognition.continuous = true;
            recognition.lang = "ja";
            recognition.onresult = function (event) {
                const currentTime = audioElement?.currentTime ?? 0;
                const speechRecognitionResults = Array.from(event.results);
                const text = speechRecognitionResults
                    .map((r, i) => {
                        const speechRecognitionAlternative = r.item(i);
                        if (!speechRecognitionAlternative) {
                            return "";
                        }
                        return speechRecognitionAlternative.transcript;
                    })
                    .join(" ");
                const finalResult = speechRecognitionResults.find((result) => result.isFinal);
                liveTranscript.add({
                    text,
                    currentTime
                });
                const liveTranscriptResult = liveTranscript.get();
                const formattedTime = toHHMMSS(currentTime);
                console.groupCollapsed(formattedTime);
                console.log(liveTranscriptResult);
                console.groupEnd();
                const processingText = liveTranscriptResult.items
                    .map((t, index) => {
                        return t.text;
                    })
                    .join("");
                setSpeechingText(<>{processingText}</>);
                if (finalResult) {
                    addLog(liveTranscriptResult);
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
    };
    const onStop = () => {
        setPlaying(false);
    };
    const onClickLog = (log: createLiveTranscriptResult) => {
        if (audioElement?.currentTime) {
            audioElement.currentTime = log.items[0].startTime;
        }
    };

    const onDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];
            const src = URL.createObjectURL(file);
            if (!audioElement) {
                return;
            }
            audioElement.src = src;
            setSpeechingLogs([]);
            setSpeechingText(<></>);
        },
        [audioElement]
    );
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    return (
        <div
            className={"AudioPlayer"}
            style={{
                width: "100%"
            }}
        >
            <section className="container">
                <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <p>Drag and Drop audio(mp3) files here, or click to select files</p>
                </div>
            </section>
            <div
                style={{
                    display: "flex"
                }}
            >
                <audio
                    className={"Audio"}
                    src={"debug.m4a"}
                    autoPlay={playing}
                    controls={true}
                    onPlay={onPlay}
                    onPause={onStop}
                    ref={audioRef}
                />
                <SelectAudioDevice
                    className={"SelectAudioDevice"}
                    audioElement={audioElement}
                    defaultDeviceNames={virtualAudioDeviceNames}
                />
            </div>
            {/*<AudioWave audioElement={audioElement} />*/}
            <AudioTranscript onClickLog={onClickLog} speechingText={speechingText} logs={speechingLogs} />
        </div>
    );
}
