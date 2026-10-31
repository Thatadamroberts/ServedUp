import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.7,
};

/**
 * Copies a picked photo into the app's document directory so it survives cache clears,
 * and returns the permanent URI.
 */
function persist(uri: string, completionId: string): string {
  if (Platform.OS === 'web') return uri;
  try {
    const dir = new Directory(Paths.document, 'dish-photos');
    if (!dir.exists) dir.create({ intermediates: true });
    const ext = uri.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg';
    // Unique name per capture so <Image> doesn't show a stale cached copy after a retake.
    const dest = new File(dir, `${completionId}-${Date.now()}.${ext}`);
    new File(uri).copySync(dest);
    return dest.uri;
  } catch (e) {
    console.warn('Could not persist photo, using original uri', e);
    return uri;
  }
}

export function deletePhotoFile(uri: string | undefined) {
  if (!uri || Platform.OS === 'web') return;
  try {
    const f = new File(uri);
    if (f.exists && f.uri.includes('dish-photos')) f.delete();
  } catch {
    // Best effort.
  }
}

export async function capturePhoto(source: 'camera' | 'library', completionId: string): Promise<string | null> {
  if (source === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera needed', 'Allow camera access in Settings to snap your dish.');
      return null;
    }
    const res = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
    if (res.canceled || !res.assets?.[0]) return null;
    return persist(res.assets[0].uri, completionId);
  }
  const res = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
  if (res.canceled || !res.assets?.[0]) return null;
  return persist(res.assets[0].uri, completionId);
}
