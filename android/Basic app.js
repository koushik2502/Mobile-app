import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import database from '@react-native-firebase/database';

const deviceId = 'device_001';

export default function App() {
  const [command, setCommand] = useState(null);
  const [status, setStatus] = useState('Idle');

  useEffect(() => {
    const commandRef = database().ref(`/commands/${deviceId}`);

    const onCommandChange = snapshot => {
      const cmd = snapshot.val();
      if (cmd) {
        setCommand(cmd);
        if (cmd.action === 'start') setStatus('Data collection started');
        else if (cmd.action === 'stop') setStatus('Data collection stopped');
        else setStatus(`Unknown command: ${cmd.action}`);
      }
    };

    commandRef.on('value', onCommandChange);

    return () => {
      commandRef.off('value', onCommandChange);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Control Agent</Text>
      <Text>Status: {status}</Text>
      <Text>Last Command: {command ? JSON.stringify(command) : 'None'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 }
});
