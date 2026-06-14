import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { formatDate, getElapsed, pad } from '@/utils/elapsed';
import type { TrackedEvent } from '@/utils/storage';

interface Props {
  event: TrackedEvent;
  tick: number;
  onDelete: (id: string) => void;
}

const UNITS = ['year', 'month', 'day', 'hour', 'min', 'sec'] as const;

export function EventCard({ event, onDelete }: Props) {
  const e = getElapsed(event.timestamp);
  const values = [e.years, e.months, e.days, e.hours, e.minutes, e.seconds];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{event.name}</Text>
        <Pressable onPress={() => onDelete(event.id)} hitSlop={12}>
          <Text style={styles.deleteIcon}>×</Text>
        </Pressable>
      </View>

      <Text style={styles.since}>since {formatDate(event.timestamp)}</Text>

      <View style={styles.unitRow}>
        {values.map((v, i) => (
          <View key={UNITS[i]} style={styles.unitCell}>
            <Text style={styles.unitNumber}>{pad(v)}</Text>
            <Text style={styles.unitLabel}>{UNITS[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  deleteIcon: {
    color: Colors.dim,
    fontSize: 22,
    lineHeight: 24,
  },
  since: {
    color: Colors.dim,
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 18,
  },
  unitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  unitCell: {
    alignItems: 'center',
    flex: 1,
  },
  unitNumber: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  unitLabel: {
    color: Colors.dim,
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
