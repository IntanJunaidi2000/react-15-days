import { useState, useEffect, useRef } from "react"

function PomodoroTimer(){
  const [mode, setMode] = useState("work")
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [workMinutes, setWorkMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)
  const [showSettings, setShowSettings] = useState(false)
  const [isClosingSettings, setIsClosingSettings] = useState(false)
  const [showBreakPrompt, setShowBreakPrompt] = useState(false)
  const intervalRef = useRef(null) //useRef stores value that persists across renders
  const modeRef = useRef(mode)

  const durations = {
    work: workMinutes * 60,
    break: breakMinutes * 60
  }

  const MODES = {
    work: { label: "Work" },
    break: { label: "Break" }
  }

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  // format seconds into MM:SS
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  // calculate progress ring
  const total = durations[mode]
  const progress = timeLeft / total
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  // tick every second when running
  useEffect(() => {
    if (isRunning){
        // start interval
        intervalRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) { //time almost up
              clearInterval(intervalRef.current) //stop ticking
              playBeep() //beep after timer up
              setTimeout(() => playBeep(), 600)
              setTimeout(() => playBeep(), 1200)
              const next = modeRef.current === "work" ? "break" : "work"
              setMode(next) //mark timer as stopped
              setTimeLeft(next === "work" ? workMinutes * 60 : breakMinutes * 60) //flip from work and break
              return 0 //set timeLeft to 0
            }
            return prev - 1 //time still going
          })
        }, 1000) // 1000ms = 1 second
    } else {
      // stop interval
      clearInterval(intervalRef.current)
    }
    // cleans up the clock component
    return () => clearInterval(intervalRef.current)
  }, [isRunning, mode])

  function switchMode() {
    const next = mode === "work" ? "break" : "work"
    setMode(next)
    setTimeLeft(MODES[next].duration)
  }

  function handleStartPause() {
    setIsRunning((prev) => !prev)
  }

  function handleReset() {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setTimeLeft(durations[mode])
  }

  function handleSwitchMode(newMode) {
    if (newMode === "break") {
      setShowBreakPrompt(true)  // intercept — show prompt first
      return
    }
    // work mode switches immediately, no prompt needed
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(durations[newMode])
  }

  function handleApplySettings() {
    const clampedWork = Math.min(60, Math.max(1, workMinutes))
    const clampedBreak = Math.min(30, Math.max(1, breakMinutes))

    clearInterval(intervalRef.current)
    setIsRunning(false)
    setWorkMinutes(clampedWork)
    setBreakMinutes(clampedBreak)
    setTimeLeft(mode === "work" ? clampedWork * 60 : clampedBreak * 60)
    handleCloseSettings()
  }

  function handleCloseSettings() {
    setIsClosingSettings(true)
    setTimeout(() => {
      setShowSettings(false) // actually remove the box from DOM
      setIsClosingSettings(false) // reset the closing flag for next time
    }, 250) // delay in 250 ms
  }

  function handleConfirmBreak() {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setMode("break")
    setTimeLeft(durations["break"])
    setShowBreakPrompt(false)
  }

  function handleCancelBreak() {
    setShowBreakPrompt(false)
  }

  function playBeep() {
    const audioContext = new AudioContext() //audio engine
    const oscillator = audioContext.createOscillator() //sound wave
    const gainNode = audioContext.createGain() //controls volume

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = "sine"
    oscillator.frequency.value = 440  // lower pitch (was 880)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)  // quieter (was 0.3)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5) //fade out

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  return  (
    <div className="card">
      <div className="top-row">
        <div className="mode-tabs">
          {Object.keys(MODES).map((m) => (
            <button
              key={m}
              className={`mode-tab ${mode === m ? "active" : ""}`}
              onClick={() => handleSwitchMode(m)}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>
        <button className="settings-btn" onClick={() => {
          if (showSettings) {
            handleCloseSettings()
          } else {
            setShowSettings(true)
          }
        }}>
          ⚙
        </button>
      </div>

      {showSettings && (
        <div className={`settings-box ${isClosingSettings ? "closing" : ""}`}>
          <div className="settings-row">
            <label>Work (min)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={workMinutes}
              onChange={(e) => setWorkMinutes(Number(e.target.value))}
            />
          </div>
          <div className="settings-row">
            <label>Break (min)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
            />
          </div>
          <button className="apply-btn" onClick={handleApplySettings}>Apply</button>
        </div>
      )}

      {showBreakPrompt && (
        <div className="settings-box" style={{ animation: "slideDown 0.25s ease" }}>
          <p className="prompt-text">Ready for a break? This will reset your current timer.</p>
          <div className="settings-row">
            <button className="apply-btn cancel" onClick={handleCancelBreak}>Not yet</button>
            <button className="apply-btn" onClick={handleConfirmBreak}>Take a break</button>
          </div>
        </div>
      )}

        <div className="ring-container">
          <svg width="220" height="220" viewBox="0 0 220 220">
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B7A3E3" />
                  <stop offset="50%" stopColor="#C2E2FA" />
                  <stop offset="100%" stopColor="#FF8F8F" />
                </linearGradient>
              </defs>
            <circle
              cx="110" cy="110" r={radius}
              fill="none"
              stroke="var(--bg-border)"
              strokeWidth="10"
            />
            <circle
              cx="110" cy="110" r={radius}
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 110 110)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="ring-text">
            <span className="time">{formatTime(timeLeft)}</span>
            <span className="mode-label">{MODES[mode].label}</span>
          </div>
        </div>

        <div className="controls">
          <button className="btn-secondary" onClick={handleReset}>Reset</button>
          <button className="btn-primary" onClick={handleStartPause}>
            {isRunning ? "Pause" : "Start"}
          </button>
        </div>
      </div>
  )

}

export default PomodoroTimer