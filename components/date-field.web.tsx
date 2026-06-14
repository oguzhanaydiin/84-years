import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';

export interface DateFieldProps {
  label: string;
  value: Date;
  mode: 'date' | 'time';
  onChange: (date: Date) => void;
}

export function DateField({ label, value, mode, onChange }: DateFieldProps) {
  const inputValue =
    mode === 'date'
      ? value.toISOString().split('T')[0]
      : `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;

  const handleChange = (raw: string) => {
    if (!raw) return;
    if (mode === 'date') {
      const [y, m, d] = raw.split('-').map(Number);
      const next = new Date(value);
      next.setFullYear(y, m - 1, d);
      onChange(next);
    } else {
      const [h, m] = raw.split(':').map(Number);
      const next = new Date(value);
      next.setHours(h, m, 0);
      onChange(next);
    }
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <input
        type={mode}
        value={inputValue}
        max={mode === 'date' ? new Date().toISOString().split('T')[0] : undefined}
        onChange={e => handleChange(e.target.value)}
        style={{
          background: 'transparent',
          border: 'none',
          color: Colors.white,
          fontSize: 15,
          fontWeight: '600',
          cursor: 'pointer',
          outline: 'none',
          colorScheme: 'dark',
        } as React.CSSProperties}
      />
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: Colors.dim,
    fontSize: 14,
  },
});
