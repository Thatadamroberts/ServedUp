import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { Body, Panel, PixelButton, PixelText } from './ui';

export interface DialogSpec {
  title: string;
  message: string;
  /** Label for the confirm button. Omit for an info-only dialog. */
  confirmLabel?: string;
  onConfirm?: () => void;
  danger?: boolean;
}

/** 16-bit styled dialog used instead of native alerts so it looks the same on every platform. */
export function PixelDialog({ spec, onClose }: { spec: DialogSpec | null; onClose: () => void }) {
  return (
    <Modal transparent visible={!!spec} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close dialog">
        <Pressable style={styles.box} onPress={() => {}}>
          {spec && (
            <Panel>
              <PixelText size={11} color={colors.gold}>
                {spec.title}
              </PixelText>
              <Body style={{ marginTop: 10 }}>{spec.message}</Body>
              <View style={styles.buttons}>
                <PixelButton small variant="ghost" label={spec.onConfirm ? 'CANCEL' : 'OK'} onPress={onClose} style={{ flex: 1 }} />
                {spec.onConfirm && (
                  <PixelButton
                    small
                    variant={spec.danger ? 'red' : 'gold'}
                    label={spec.confirmLabel ?? 'OK'}
                    onPress={() => {
                      onClose();
                      spec.onConfirm?.();
                    }}
                    style={{ flex: 1 }}
                  />
                )}
              </View>
            </Panel>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', padding: 24 },
  box: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 16 },
});
