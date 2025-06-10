import React, { useState, useEffect } from 'react';
import './App.css';
import LineChart from './LineChart';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import useRealTimeData from './useRealTimeData';

export default function App() {
  const [switchState, setSwitchState] = useState(false);
  const [data, setDataState] = useState([]);
  const [lineLabel, setLineLabel] = useState('Temperature');

  const realTimeData = useRealTimeData(); // Get real-time data using the custom hook
  const labels = realTimeData.map(item => item.timestamp);

  useEffect(() => {
    setDataState(realTimeData.map(item => switchState ? item.humidity : item.temperature));
  }, [realTimeData, switchState]); // Update data whenever realTimeData or switchState changes

  function onSwitchChange() {
    setSwitchState(!switchState);
    switchState ? setLineLabel('Temperature') : setLineLabel('Humidity');
  }

  return (
    <div className="App">
      <LineChart chartData={data} chartLabels={labels} chartLineLabel={lineLabel} />
      <FormControlLabel control={<Switch />} onChange={onSwitchChange} />
    </div>
  );
}
