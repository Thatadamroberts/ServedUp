import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** The installed app's version and build number, from app.json, e.g. "v1.1.0 (build 2)". */
export function appVersionLabel(): string {
  const cfg = Constants.expoConfig;
  const version = cfg?.version ?? '?';
  const build = Platform.OS === 'ios' ? cfg?.ios?.buildNumber : cfg?.android?.versionCode;
  return build ? `v${version} (build ${build})` : `v${version}`;
}
