import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { captionFor, CARD_SIZES, DishCard, ProfileCard, type CardFormat } from '../components/ShareCards';
import { Body, Panel, PixelButton, PixelText } from '../components/ui';
import { useGameState } from '../game/GameContext';
import { colors } from '../theme';

export default function Share() {
  const { kind, id } = useLocalSearchParams<{ kind?: string; id?: string }>();
  const state = useGameState();
  const entry = kind === 'dish' ? state.completions.find((c) => c.id === id) : undefined;
  const cardRef = useRef<ComponentRef<typeof View>>(null);
  const [format, setFormat] = useState<CardFormat>('post');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const caption = captionFor(state, entry);
  const isWeb = Platform.OS === 'web';

  const flash = (m: string) => {
    setMessage(m);
    setTimeout(() => setMessage(null), 2500);
  };

  const share = async () => {
    setBusy(true);
    try {
      const size = CARD_SIZES[format];
      const uri = await captureRef(cardRef, { format: 'png', quality: 1, width: size.w, height: size.h, result: 'tmpfile' });
      if (!(await Sharing.isAvailableAsync())) return flash('Sharing is not available on this device.');
      // Copy the caption first: Instagram doesn't accept captions from the share sheet.
      await Clipboard.setStringAsync(caption).catch(() => {});
      await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: 'Share to Instagram' });
    } catch (e) {
      console.warn('Share failed', e);
      flash('Could not create the image. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const copyCaption = async () => {
    const ok = await Clipboard.setStringAsync(caption).catch(() => false);
    flash(ok ? 'Caption copied!' : 'Could not copy. Select the caption text instead.');
  };

  if (kind === 'dish' && !entry) return <Body>Dish not found.</Body>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, alignItems: 'center' }}>
      <View style={styles.toggle}>
        {(Object.keys(CARD_SIZES) as CardFormat[]).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFormat(f)}
            accessibilityRole="tab"
            accessibilityState={{ selected: format === f }}
            style={[styles.tab, format === f && { backgroundColor: colors.gold }]}
          >
            <PixelText size={8} color={format === f ? '#2b1d14' : colors.text}>
              {CARD_SIZES[f].label}
            </PixelText>
          </Pressable>
        ))}
      </View>

      <View ref={cardRef} collapsable={false} style={{ marginTop: 14 }}>
        {entry ? <DishCard state={state} entry={entry} format={format} /> : <ProfileCard state={state} format={format} />}
      </View>

      <View style={{ width: '100%', maxWidth: 420, marginTop: 16, gap: 10 }}>
        {isWeb ? (
          <Panel>
            <Body>
              In the web version, take a screenshot of the card to post it. The phone app adds a Share button that sends a
              full-size image straight to Instagram.
            </Body>
          </Panel>
        ) : (
          <PixelButton label={busy ? 'MAKING IMAGE…' : 'SHARE IMAGE ▶'} disabled={busy} onPress={share} />
        )}
        <Panel>
          <PixelText size={8} color={colors.textDim}>
            CAPTION
          </PixelText>
          <Body style={{ marginTop: 8, fontSize: 13, lineHeight: 19 }}>{caption}</Body>
        </Panel>
        <PixelButton small variant="ghost" label="COPY CAPTION" onPress={copyCaption} />
        {!isWeb && (
          <Body dim style={{ fontSize: 12, textAlign: 'center' }}>
            Sharing copies the caption too. Pick Instagram in the share sheet, then paste the caption.
          </Body>
        )}
        {message && (
          <PixelText size={8} color={colors.xp} style={{ textAlign: 'center' }}>
            {message}
          </PixelText>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 3, borderColor: colors.border, backgroundColor: colors.panel },
});
