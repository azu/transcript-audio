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
                    <h2>First</h2>
                    <ul>
                        <li>
                            You need to install <a href="https://github.com/ExistentialAudio/BlackHole">BlackHole</a> on
                            your PC
                        </li>
                        <li>Click "Play" audio button ▶ at first and Confirm "OK" for use your mike 🎤</li>
                        <li>**Reload** the page</li>
                    </ul>
                    <h2>How to get transcript?</h2>
                    <ol>
                        <li>Drag and Drop you audio file you want to transcript</li>
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
