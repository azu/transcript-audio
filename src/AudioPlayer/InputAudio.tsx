export interface InputAudioProps {
    preferAudioDeviceNames?: string[];
}

export function InputAudio(props: InputAudioProps) {
    const click = () => {
        (async () => {
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
            console.log("inputDeviceId", inputDevideId);
            const constraints = {
                audio: {
                    deviceId: inputDevideId
                }
            };
            await navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                // 成功した時の処理
                console.log("SUCCC", stream);
            });
        })().catch((error) => {
            console.error(error);
        });
    };
    return <button onClick={click}>Input</button>;
}
