import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.animas.kitchen",
  appName: "Anima's Kitchen",
  webDir: "public",
  server: {
    // In production, the native Android app loads the live deployment
    url: "https://animaskitchen.com",
    cleartext: true,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
};

export default config;
