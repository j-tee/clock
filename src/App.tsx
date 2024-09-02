import React, { useEffect, useState } from 'react';
import './App.css';
import { DisplayState } from './helpers';
import TimeSetter from './TimeSetter';
import Display from './Display';
import AlarmSound from "./assets/AlarmSound.mp3"

function App() {
  const defaultBreakTime =  5 * 60;
  const defaultSessionTime = 25 * 60;
  const min = 1 * 60; // 1 minute minimum
  const max = 60 * 60; // 60 minutes maximum
  const interval = 60; // 1 minute intervals
  // const audioRef = useRef<HTMLAudioElement>(null);

  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [sessionTime, setSessionTime] = useState(defaultSessionTime);
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: "Session",
    timerRunning: false,
  });
  useEffect(() => {
    let timerID: number;
    if (!displayState.timerRunning) return;

    if (displayState.timerRunning) {
      timerID = window.setInterval(decrementDisplay, 1000);
    }

    return () => {
      window.clearInterval(timerID);
    }
  }, [displayState.timerRunning])

  // useEffect(() => {
  //   if (displayState.time === 0 && audioRef.current) {
  //     audioRef.current.currentTime = 2;
  //     audioRef.current.play().catch((error) => console.log(error));
  //     setDisplayState((prev) => ({
  //       ...prev,
  //       timeType: prev.timeType === "Session" ? "Break" : "Session",
  //       time: prev.timeType === "Session" ? breakTime : sessionTime
  //     }));
  //   }
  // }, [displayState.time]);

  useEffect(() => {
    if (displayState.time === 0) {
        const audio = document.getElementById("beep") as HTMLAudioElement;
        audio.currentTime = 0;
        audio.play().catch((error) => console.log(error));

        // Reset timer to the next period
        setTimeout(() => {
            setDisplayState((prev) => ({
                ...prev,
                timeType: prev.timeType === "Session" ? "Break" : "Session",
                time: prev.timeType === "Session" ? breakTime : sessionTime
            }));
        }, 1000);
    }
}, [displayState.time, breakTime, sessionTime]);

const reset = () => {
  // Reset the break and session times to their default values
  setBreakTime(defaultBreakTime);
  setSessionTime(defaultSessionTime);

  // Reset the display state
  setDisplayState({
      time: defaultSessionTime, // Reset to 25:00
      timeType: "Session", // Reset to Session type
      timerRunning: false, // Stop the timer
  });

  // Stop and reset the alarm sound
  const audio = document.getElementById("beep") as HTMLAudioElement;
  audio.pause();
  audio.currentTime = 0;
}


  const decrementDisplay = () => {
    setDisplayState((prev) => ({
      ...prev,
      time: Math.max(prev.time - 1, 0) 
    }))
  }

  const startStop = () => {
    setDisplayState((prev) => ({
      ...prev,
      timerRunning: !prev.timerRunning
    }))
  }
  const changeBreakTime = (time: number) => {
    // console.log(">>>>time", time)
    if (displayState.timerRunning) return;
    setBreakTime(time)
  }

  const changeSessionTime = (time: number) => {
    console.log(">>>>time", time)
    if (displayState.timerRunning) return;
    setSessionTime(time)
    setDisplayState({
      time: time,
      timeType: "Session",
      timerRunning: false
    })
  }
  return (
    <div className="clock">
      <div className="setters">
        <div className="break">
          <h4 id="break-label">
            Break Length
          </h4>
          <TimeSetter
            time={breakTime}
            setTime={changeBreakTime}
            min={min}
            max={max}
            interval={interval}
            type="break"
          />
        </div>
        <div className="session">
          <h4 id="session-label">
            Session Length
          </h4>
          <TimeSetter
            time={sessionTime}
            setTime={changeSessionTime}
            min={min}
            max={max}
            interval={interval}
            type="session"
          />
        </div>
      </div>
      <Display
        displayState={displayState}
        reset={reset}
        startStop={startStop}
      />
      <audio src={AlarmSound} id="beep" />
    </div>
  )
}

export default App;
