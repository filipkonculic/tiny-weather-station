import { useState, useEffect, useCallback } from 'react';
import { db, ref, onValue } from './firebase';
import { query, limitToLast } from "firebase/database";

function formatUnixTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp); 

    // Adjust to GMT+2 manually
    date.setUTCHours(date.getUTCHours() + 2);

    const day = String(date.getUTCDate()).padStart(2, '0'); 
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
    return `${day}/${month} ${hours}:${minutes}`;
}

// Custom hook to fetch real-time data
function useRealTimeData() {
  const [data, setData] = useState([]); // Initial state is an empty array

  //useCallback to memoize fetchData so it doesn't get recreated on each render
  //Can be written as a regular function without useCallback?(test)
  const fetchData = useCallback(() => {
    const dbRef = ref(db, 'sensor_logs/');
    const lastTenQuery = query(dbRef, limitToLast(10));
    onValue(lastTenQuery, handleSnapshot);
  }, []); // Empty dependency array means this function doesn't depend on anything else

  // Handle the snapshot returned from Firebase
  function handleSnapshot(snapshot) {
    const usersData = snapshot.val();
    if (usersData) {
      const usersArray = Object.entries(usersData).map(([key, value]) => ({
        id: key,
        ...value,
        timestamp: formatUnixTimestamp(value.timestamp) // Convert Unix timestamp
      }));
      setData(usersArray);
    }
  }

  useEffect(() => {
    fetchData();
    return () => {
      //No cleanup logic
    };
  }, [fetchData]);//These square brackets could be empty(test)

  return data; 
}

export default useRealTimeData;
