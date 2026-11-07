import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useGame, useGameState } from '../game/GameContext';
import { techniquesFor } from '../game/techniques';
import { colors } from '../theme';
import { Body, PixelText } from './ui';

/** Simple / Detailed switch, saved with the player's settings. */
export function DetailToggle() {
  const game = useGame();
  const detailed = useGameState().settings.detailedSteps;
  return (
    <View style={styles.toggle} accessibilityRole="radiogroup" accessibilityLabel="Instruction detail">
      {[
        { on: false, label: 'SIMPLE' },
        { on: true, label: 'DETAILED' },
      ].map((o) => {
        const active = detailed === o.on;
        return (
          <Pressable
            key={o.label}
            onPress={() => game.setDetailedSteps(o.on)}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            style={[styles.tab, active && { backgroundColor: colors.gold }]}
          >
            <PixelText size={7} color={active ? '#2b1d14' : colors.text}>
              {o.label}
            </PixelText>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * How-to notes for the techniques a step uses. Always open in Detailed mode; in Simple mode a
 * small "HOW?" button opens them for just this step. In Detailed mode a technique already
 * explained in an earlier step gets a one-line pointer instead of repeating the full note.
 */
export function StepHelp({ steps, index }: { steps: string[]; index: number }) {
  const detailed = useGameState().settings.detailedSteps;
  const [open, setOpen] = useState(false);
  const step = steps[index];
  const techniques = techniquesFor(step);
  if (!techniques.length) return null;
  const show = detailed || open;
  const firstSeen = (id: string) => steps.findIndex((s) => techniquesFor(s).some((t) => t.id === id));
  return (
    <View style={{ marginTop: 6 }}>
      {!detailed && (
        <Pressable
          onPress={() => setOpen((o) => !o)}
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessibilityLabel={open ? 'Hide technique help' : `How to: ${techniques.map((t) => t.name).join(', ')}`}
          hitSlop={8}
          style={styles.how}
        >
          <PixelText size={7} color={colors.blue}>
            {open ? 'HIDE ▴' : `HOW? ▾  ${techniques.map((t) => t.name.toUpperCase()).join(' · ')}`}
          </PixelText>
        </Pressable>
      )}
      {show &&
        techniques.map((t) => {
          const first = firstSeen(t.id);
          if (detailed && first < index) {
            return (
              <PixelText key={t.id} size={7} color={colors.textDim} style={{ marginTop: 6 }}>
                ↑ {t.name.toUpperCase()}: SEE STEP {first + 1}
              </PixelText>
            );
          }
          return (
            <View key={t.id} style={styles.note}>
              <PixelText size={7} color={colors.gold}>
                {t.name.toUpperCase()}
              </PixelText>
              <Body style={styles.noteText}>{t.how}</Body>
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row' },
  tab: { paddingHorizontal: 8, paddingVertical: 6, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.panel },
  how: { alignSelf: 'flex-start', paddingVertical: 2 },
  note: {
    marginTop: 6,
    backgroundColor: colors.bgDeep,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  noteText: { fontSize: 13, lineHeight: 19, marginTop: 4 },
});
