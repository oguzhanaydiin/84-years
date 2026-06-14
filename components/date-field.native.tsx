import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { Platform, Pressable, StyleSheet, Text } from 'react-native'

import { Colors } from '@/constants/colors'

export interface DateFieldProps {
  label: string;
  value: Date;
  mode: 'date' | 'time';
  onChange: (date: Date) => void;
}

export function DateField({ label, value, mode, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);

  const display =
    mode === 'date'
      ? value.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <Pressable style={styles.row} onPress={() => setOpen(true)}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{display}</Text>
      </Pressable>

      {open && (
        <DateTimePicker
          value={value}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={mode === 'date' ? new Date() : undefined}
          onChange={(_, picked) => {
            setOpen(false);
            if (!picked) return;
            if (mode === 'date') {
              const next = new Date(picked);
              next.setHours(value.getHours(), value.getMinutes(), 0);
              onChange(next);
            } else {
              const next = new Date(value);
              next.setHours(picked.getHours(), picked.getMinutes(), 0);
              onChange(next);
            }
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: Colors.dim,
    fontSize: 14,
  },
  value: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
