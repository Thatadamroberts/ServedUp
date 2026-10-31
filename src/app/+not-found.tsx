import { Redirect } from 'expo-router';

/** Any unknown URL (e.g. when the web build is hosted under a sub-path) goes back to the start. */
export default function NotFound() {
  return <Redirect href="/" />;
}
