import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";

export interface UseImagePickerOptions {
  aspect?: [number, number];
  quality?: number;
}

export interface UseImagePickerResult {
  readonly takePhoto: () => Promise<string | null>;
  readonly pickFromLibrary: () => Promise<string | null>;
}

const DEFAULT_OPTIONS: Required<UseImagePickerOptions> = {
  aspect: [3, 4],
  quality: 0.8,
};

/**
 * Reusable hook for picking images via camera or media library.
 * Returns `null` if the user cancels or denies permission.
 */
export function useImagePicker(
  options: UseImagePickerOptions = {},
): UseImagePickerResult {
  const { aspect, quality } = { ...DEFAULT_OPTIONS, ...options };

  const takePhoto = useCallback(async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect,
      quality,
    });

    if (result.canceled || !result.assets?.length) return null;
    return result.assets[0].uri;
  }, [aspect, quality]);

  const pickFromLibrary = useCallback(async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect,
      quality,
    });

    if (result.canceled || !result.assets?.length) return null;
    return result.assets[0].uri;
  }, [aspect, quality]);

  return { takePhoto, pickFromLibrary };
}
