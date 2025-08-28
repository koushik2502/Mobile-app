import React, { useEffect, useState } from 'react';
import { Alert, Linking, View, Text, Switch, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import SendSMS from 'react-native-sms';
import { database } from './app/firebase-config';
import { ref, set, onValue } from '@react-native-firebase/database';

const deviceId = 'device_001';

export default function App() {
  const [deviceInfo, setDeviceInfo] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Stopped');

  useEffect(() => {
    if (isActive) {
      startDataCollection();
    } else {
      stopDataCollection();
    }
  }, [isActive]);

  useEffect(() => {
    const commandsRef = ref(database, `/phones/${deviceId}/commands`);
    const unsubscribe = onValue(commandsRef, snapshot => {
      const cmd = snapshot.val();
      if (!cmd) return;

      switch (cmd.type) {
        case 'send_sms':
          SendSMS.send({
            body: cmd.message,
            recipients: [cmd.phoneNumber],
            successTypes: ['sent', 'queued'],
          }, (completed, cancelled, error) => {
            Alert.alert(
              'SMS Status',
              completed ? 'Sent' : cancelled ? 'Cancelled' : 'Failed',
            );
          });
          break;

        case 'open_app':
          Linking.openURL(`intent://#Intent;package=${cmd.packageName};end`);
          break;

        default:
          console.warn('Unknown command type:', cmd.type);
      }
      // Clear command to avoid repeated execution
      set(commandsRef, null);
    });

    return () => unsubscribe();
  }, []);

  const startDataCollection = async () => {
    setStatus('Running - Ready to connect to dashboard');
    try {
      const info = {
        name: await DeviceInfo.getDeviceName(),
        batteryLevel: Math.round((await DeviceInfo.getBatteryLevel()) * 100),
        brand: await DeviceInfo.getBrand(),
        model: await DeviceInfo.getModel(),
      };
      setDeviceInfo(info);
      await set(ref(database, `/phones/${deviceId}/deviceInfo`), info);
    } catch (error) {
      console.error('Error syncing device info:', error);
    }
  };

  const stopDataCollection = () => {
    setStatus('Stopped');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Control Agent</Text>

      <View style={styles.section}>
        <Text>Status: {status}</Text>
        <Switch value={isActive} onValueChange={setIsActive} />
      </View>

      <View style={styles.section}>
        <Text>📱 Device: {deviceInfo.name}</Text>
        <Text>🔋 Battery: {deviceInfo.batteryLevel}%</Text>
        <Text>🏭 Brand: {deviceInfo.brand}</Text>
        <Text>📋 Model: {deviceInfo.model}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 15 },
});
