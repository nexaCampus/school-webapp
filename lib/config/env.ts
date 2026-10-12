/**
 * NexaCampus Centralized Environment & Runtime Configuration
 *
 * Provides type-safe validation, runtime defaults, and environment isolation.
 * Prevents raw `process.env` references from being scattered across business logic.
 */

export interface FirebaseEnvironmentConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  vapidKey?: string;
}

export interface ApiEnvironmentConfig {
  goBackendUrl: string;
  publicGoApiUrl: string;
  apiBaseUrl: string;
}

export interface AppEnvironmentConfig {
  isDev: boolean;
  isProd: boolean;
  isTest: boolean;
  version: string;
  schoolCode: string;
  defaultAdmissionId: string;
}

function getEnvVar(key: string, defaultValue = ''): string {
  if (typeof process === 'undefined' || !process.env) {
    return defaultValue;
  }
  return process.env[key] ?? defaultValue;
}

export const firebaseEnv: FirebaseEnvironmentConfig = {
  apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY', 'REDACTED_GOOGLE_API_KEY'),
  authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'nexacampusschool.firebaseapp.com'),
  projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'nexacampusschool'),
  storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'nexacampusschool.firebasestorage.app'),
  messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_SENDER_ID', '116245328238'),
  appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID', '1:116245328238:web:f8c93f7dfd23b982b9917f'),
  measurementId: getEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', 'G-44LZ7VW9W0'),
  vapidKey: getEnvVar('NEXT_PUBLIC_FIREBASE_VAPID_KEY') || undefined,
};

export const apiEnv: ApiEnvironmentConfig = {
  goBackendUrl: getEnvVar('GO_BACKEND_URL') || getEnvVar('NEXT_PUBLIC_GO_API_URL', 'https://backend-school-go.onrender.com'),
  publicGoApiUrl: getEnvVar('NEXT_PUBLIC_GO_API_URL', 'https://backend-school-go.onrender.com'),
  apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL') || getEnvVar('NEXT_PUBLIC_GO_API_URL', 'https://backend-school-go.onrender.com'),
};

const nodeEnv = getEnvVar('NODE_ENV', 'development');

export const appEnv: AppEnvironmentConfig = {
  isDev: nodeEnv === 'development',
  isProd: nodeEnv === 'production',
  isTest: nodeEnv === 'test',
  version: '2.6.0',
  schoolCode: 'LCGVM-KOL',
  defaultAdmissionId: '3651121',
};

export const env = {
  firebase: firebaseEnv,
  api: apiEnv,
  app: appEnv,
} as const;

export default env;
