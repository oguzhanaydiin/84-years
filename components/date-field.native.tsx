import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import { Colors } from '@/constants/colors'

export interface DateFieldProps {
  label: string;
  value: Date;
  mode: 'date' | 'time';
  onChange: (date: Date) => void;
}

export function DateField({ label, value, mode, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  const display =
    mode === 'date'
      ? value.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleOpen = () => {
    setDraft(value);
    setOpen(true);
  };

  const handleConfirm = () => {
    setOpen(false);
    onChange(draft);
  };

  const handleCancel = () => setOpen(false);

  const handleChange = (_: unknown, picked?: Date) => {
    if (!picked) return;
    if (Platform.OS === 'android') {
      setOpen(false);
      onChange(picked);
    } else {
      setDraft(picked);
    }
  };

  if (Platform.OS === 'ios') {
    return (
      <>
        <Pressable style={styles.row} onPress={handleOpen}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{display}</Text>
        </Pressable>

        <Modal visible={open} transparent animationType="slide" onRequestClose={handleCancel}>
          <Pressable style={styles.backdrop} onPress={handleCancel} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Pressable onPress={handleCancel} hitSlop={12}>
                <Text style={styles.sheetAction}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleConfirm} hitSlop={12}>
                <Text style={[styles.sheetAction, styles.sheetConfirm]}>Done</Text>
              </Pressable>
            </View>
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={draft}
                mode={mode}
                display="spinner"
                maximumDate={mode === 'date' ? new Date() : undefined}
                onChange={handleChange}
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Pressable style={styles.row} onPress={handleOpen}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{display}</Text>
      </Pressable>

      {open && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          maximumDate={mode === 'date' ? new Date() : undefined}
          onChange={handleChange}
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sheetAction: {
    fontSize: 16,
    color: Colors.dim,
  },
  sheetConfirm: {
    color: Colors.accent,
    fontWeight: '600',
  },
  pickerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  picker: {
    width: '100%',
  },
});
