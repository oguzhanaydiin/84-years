import { router } from 'expo-router'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { DateField } from '@/components/date-field'
import { Colors } from '@/constants/colors'
import { loadEvents, saveEvents, type TrackedEvent } from '@/utils/storage'

export default function Add() {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());

  const canSave = name.trim().length > 0;

  const save = async (useNow: boolean) => {
    if (!canSave) return;

    const newEvent: TrackedEvent = {
      id: Date.now().toString(),
      name: name.trim(),
      timestamp: useNow ? Date.now() : date.getTime(),
    };

    const existing = await loadEvents();
    await saveEvents([newEvent, ...existing]);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>New Event</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.fieldLabel}>What are you tracking?</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="e.g. Haven't smoked"
          placeholderTextColor={Colors.dim}
          value={name}
          onChangeText={setName}
          autoFocus
          returnKeyType="done"
          maxLength={60}
        />

        <Text style={[styles.fieldLabel, { marginTop: 32 }]}>Since when?</Text>

        <DateField
          label="Date"
          value={date}
          mode="date"
          onChange={(d: Date) => setDate(prev => {
            const next = new Date(d); 
            next.setHours(prev.getHours(), prev.getMinutes(), 0);
            return next;
          })}
        />

        <DateField
          label="Time"
          value={date}
          mode="time"
          onChange={(d: Date) => setDate(prev => {
            const next = new Date(prev);
            next.setHours(d.getHours(), d.getMinutes(), 0);
            return next;
          })}
        />
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.primaryBtn, !canSave && styles.disabled]}
          onPress={() => save(false)}
          disabled={!canSave}
        >
          <Text style={styles.primaryBtnText}>Start Tracking</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryBtn, !canSave && styles.disabled]}
          onPress={() => save(true)}
          disabled={!canSave}
        >
          <Text style={styles.secondaryBtnText}>Use right now instead</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 20,
  },
  back: {
    color: Colors.white,
    fontSize: 24,
  },
  title: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  fieldLabel: {
    color: Colors.dim,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  nameInput: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.white,
    fontSize: 18,
    fontWeight: '500',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 4,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 100,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.dim,
    fontSize: 14,
  },
  disabled: {
    opacity: 0.35,
  },
});
