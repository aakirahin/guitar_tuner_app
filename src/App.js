import { useState } from 'react';
import './App.css';
import Pitch from './Pitch';
import { tunings } from './utils/tuning';

function App() {
  const [tuning, setTuning] = useState("eadgbe")

  const changeTuning = (ev) => setTuning(ev.target.value)

  return (
    <div id="container">
      <Pitch tuning={tuning} />
      <select name="tunings" id="tunings" value={tuning} onChange={(ev) => changeTuning(ev)}>
        {Object.keys(tunings).map((tuning) => {
          return <option value={tuning}>{tunings[tuning].name} - {tuning.toUpperCase()}</option>
        })}
      </select>
    </div>
  );
}

export default App;