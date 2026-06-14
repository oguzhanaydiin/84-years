import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TrackedEvent {
  id: string;
  name: string;
  timestamp: number;
}

const KEY = 'tracked_events_v1';

export async function loadEvents(): Promise<TrackedEvent[]> {
  const val = await AsyncStorage.getItem(KEY);
  return val ? JSON.parse(val) : [];
}

export async function saveEvents(events: TrackedEvent[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(events));
}
