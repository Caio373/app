declare module 'react' {
  export type ReactNode = unknown;
  export function useState<T>(initial: T): [T, (value: T | ((previous: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: unknown[]): T;
  const React: { createElement: (...args: any[]) => unknown };
  export default React;
}

declare module 'react-native' {
  export const Alert: { alert: (title: string, message?: string) => void };
  export const Pressable: any;
  export const ScrollView: any;
  export const SafeAreaView: any;
  export const StatusBar: any;
  export const Text: any;
  export const TextInput: any;
  export const View: any;
  export const StyleSheet: { create: <T extends Record<string, any>>(styles: T) => T };
}

declare module 'react-native-svg' {
  export const Circle: any;
  export const Line: any;
  export const Path: any;
  const Svg: any;
  export default Svg;
}

declare module 'expo-location' {
  export function requestForegroundPermissionsAsync(): Promise<{ status: 'granted' | 'denied' | string }>;
}

declare module 'expo-secure-store' {
  export function getItemAsync(key: string): Promise<string | null>;
  export function setItemAsync(key: string, value: string): Promise<void>;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: { getItem: (key: string) => Promise<string | null>; setItem: (key: string, value: string) => Promise<void> };
  export default AsyncStorage;
}

declare namespace JSX {
  interface IntrinsicElements { [elementName: string]: any; }
}
