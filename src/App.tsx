import React from "react";
import "./App.css";
import { AudioPlayer } from "./AudioPlayer/AudioPlayer";

function App() {
    return (
        <div className="App">
            <header className={"App-Header"}>
                <h1>🔈📝 Transcript Audio</h1>
                <details>
                    <summary>
                        Usage: ⚠️ Need <a href="https://github.com/ExistentialAudio/BlackHole">BlackHole</a> before
                        playing
                    </summary>
                    <ol>
                        <li>
                            You need to install <a href="https://github.com/ExistentialAudio/BlackHole">BlackHole</a> on
                            your PC
                        </li>
                        <li>Drag and Drop you audio file you want to transcript to following</li>
                        <li>Play Audio and wait for transcription!</li>
                    </ol>
                </details>
            </header>
            <main className={"App-Main"}>
                <AudioPlayer />
            </main>
        </div>
    );
}

export default App;
