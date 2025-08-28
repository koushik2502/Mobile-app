import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, onValue, set } from "firebase/database";

const deviceId = "device_001";

const App = () => {
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    const infoRef = ref(database, `/phones/${deviceId}/deviceInfo`);
    const unsubscribe = onValue(infoRef, (snapshot) => {
      setDeviceInfo(snapshot.val() || {});
    });
    return () => unsubscribe();
  }, []);

  const sendSms = () => {
    const commandsRef = ref(database, `/phones/${deviceId}/commands`);
    set(commandsRef, {
      type: "send_sms",
      phoneNumber: "+1234567890",
      message: "Hello from web dashboard!",
      timestamp: Date.now()
    });
  };

  const openApp = () => {
    const commandsRef = ref(database, `/phones/${deviceId}/commands`);
    set(commandsRef, {
      type: "open_app",
      packageName: "com.example.phonecontrol",
      timestamp: Date.now()
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Phone Control Dashboard</h1>
      <pre style={{ background: "#eee", padding: 10 }}>
        {JSON.stringify(deviceInfo, null, 2)}
      </pre>
      <button onClick={sendSms}>Send SMS</button>
      <button onClick={openApp} style={{ marginLeft: 10 }}>Force Open App</button>
    </div>
  );
};

export default App;
