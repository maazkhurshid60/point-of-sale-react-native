import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export const downloadService = {
  /**
   * Downloads media from a URL and saves it to the local filesystem.
   * If on mobile, it uses the Sharing API to save it.
   */
  downloadMedia: async (
    url: string, 
    fileName: string, 
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    
    const downloadResumable = FileSystem.createDownloadResumable(
      url, 
      fileUri, 
      {}, 
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        if (onProgress) onProgress(progress);
      }
    );
    
    try {
      const result = await downloadResumable.downloadAsync();
      if (result) {
        // If on Android/iOS, trigger the share/save menu.
        if (Platform.OS !== "web") {
          const canShare = await Sharing.isAvailableAsync();
          if (canShare) {
            await Sharing.shareAsync(result.uri);
          }
        }
        return result.uri;
      }
    } catch (e) {
      console.error("Download failed", e);
      throw e;
    }
    return "";
  }
};
