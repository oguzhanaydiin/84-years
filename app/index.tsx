import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

import { EventCard } from '@/components/event-card';
import { Colors } from '@/constants/colors';
import { loadEvents, saveEvents, type TrackedEvent } from '@/utils/storage';

export default function Index() {
  const [events, setEvents] = useState<TrackedEvent[]>([]);
  const [tick, setTick] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadEvents().then(e => {
        setEvents(e);
        setLoading(false);
      });
    }, []),
  );

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const deleteEvent = async (id: string) => {
    const next = events.filter(e => e.id !== id);
    setEvents(next);
    await saveEvents(next);
  };

  if (loading) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topBar}>
        <Text style={styles.title}>84 Years</Text>
        <Pressable style={styles.addBtn} onPress={() => router.push('/add' as never)}>
          <Text style={styles.addBtnIcon}>+</Text>
        </Pressable>
      </View>

      {events.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>◎</Text>
          <Text style={styles.emptyTitle}>Nothing tracked yet</Text>
          <Text style={styles.emptySub}>Tap + to add your first event</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <EventCard event={item} tick={tick} onDelete={deleteEvent} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 20,
  },
  title: {
    color: Colors.white,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnIcon: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '300',
  },
  list: {
    padding: 16,
    gap: 14,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyIcon: {
    color: Colors.dim,
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  emptySub: {
    color: Colors.dim,
    fontSize: 14,
  },
});
