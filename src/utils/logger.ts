/**
 * A production-safe logger that prevents console logs from cluttering 
 * the production environment or causing performance issues (like JSON.stringify on large objects).
 */

const isDevelopment = __DEV__; // React Native specific flag

export const Logger = {
  log: (message: string, ...optionalParams: any[]) => {
    if (isDevelopment) {
      console.log(`[LOG] ${message}`, ...optionalParams);
    }
  },
  
  info: (message: string, ...optionalParams: any[]) => {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, ...optionalParams);
    }
  },

  warn: (message: string, ...optionalParams: any[]) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...optionalParams);
    }
  },

  error: (message: string, ...optionalParams: any[]) => {
    // We might want to always log errors or send them to a crash analytics tool
    console.error(`[ERROR] ${message}`, ...optionalParams);
  },

  // Specialized method to replace JSON.stringify clutter
  debugPayload: (label: string, payload: any) => {
    if (isDevelopment) {
      try {
        console.groupCollapsed(`[PAYLOAD] ${label}`);
        console.log(JSON.stringify(payload, null, 2));
        console.groupEnd();
      } catch (e) {
        console.log(`[PAYLOAD] ${label} (Un-stringifiable object)`, payload);
      }
    }
  }
};
