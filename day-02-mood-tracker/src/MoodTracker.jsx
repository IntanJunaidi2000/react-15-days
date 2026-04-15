import { useState } from "react"

const moods = [
  { emoji: "😄", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "😴", label: "Tired" },
]

function MoodTracker() {
  const [showWarning, setShowWarning] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [dancing, setDancing] = useState(null)
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState(() => { //lazy initialisation
    const saved = localStorage.getItem("moodHistory")
    return saved ? JSON.parse(saved) : []  //? is optional chaining - safely checks if 'selected' exists 
  })

  function handleMoodClick(mood){
    setSelected(mood)
    setDancing(mood.label)
    setTimeout(() => setDancing(null), 500)
  }

  function handleLog(){
    if (!selected) return

    const entry = {
      emoji: selected.emoji,
      label: selected.label,
      date: new Date().toLocaleDateString("en-MY", {
        weekday: "short",
        day: "numeric",
        month: "short"
      }),
      time: new Date().toLocaleTimeString("en-MY", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    }

    const updated = [entry, ...history] // ... is spread operator
    setHistory(updated) //updates the state so screen re-renders with new history
    localStorage.setItem("moodHistory", JSON.stringify(updated)) //saves to browser storage
    //stringify converts array to a string bcs localStorage only stores strings
    setSelected(null)//clears selection after logging
  }

  //filter loops through every item and keeps only ones where the condition is true
  // _ means dont care about the item, just the index

  function handleClearOne(indexToRemove) {
    const updated = history.filter((_, index) => index !== indexToRemove)
    setHistory(updated)
    localStorage.setItem("moodHistory", JSON.stringify(updated))
  }

  function handleClearAll() {
    setShowWarning(true)
  }

  function handleConfirmClear() {
    setHistory([])
    localStorage.removeItem("moodHistory")
    setShowWarning(false)
  }

  function handleClose() {
    setIsClosing(true)
    setTimeout(() => {
        setShowWarning(false)
        setIsClosing(false)
    }, 250)
  }

  return (
    <div className="card">
      <h1 className="heading">How are you feeling today?</h1>

      <div className="mood-grid">
        {moods.map((mood) => (
          <button
            key={mood.label}
            className={`mood-btn ${selected?.label === mood.label ? "active" : ""}`}
            onClick={() => handleMoodClick(mood)}
          >
            <span className={`emoji ${dancing === mood.label ? "dancing" : ""}`}>
                {mood.emoji}
            </span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>

      <button className="log-btn" onClick={handleLog}>
        Log mood
      </button>

      {history.length > 0 && (
        <div className="history">
          <div className="history-header">
            <p className="label">History</p>
            <button className="clear-btn" onClick={handleClearAll}>Clear all</button>
          </div>

          {showWarning && (
            <div className={`warning-box ${isClosing ? "closing" : ""}`}>
                <p className="warning-text">⚠️ This will delete all mood logs. Are you sure?</p>
                <div className="warning-actions">
                <button className="warning-cancel" onClick={handleClose}>Cancel</button>
                <button className="warning-confirm" onClick={handleConfirmClear}>Yes, clear all</button>
                </div>
            </div>
            )}
          {history.map((entry, index) => (
            <div key={index} className="history-row">
              <span className="history-emoji">{entry.emoji}</span>
              <span className="history-label">{entry.label}</span>
              <span className="history-date">{entry.date}, {entry.time}</span>
              <button className="delete-btn" onClick={() => handleClearOne(index)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MoodTracker