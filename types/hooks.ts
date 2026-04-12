/**
 * Return type interfaces for custom hooks.
 * Keeps hooks lean — they export a named return type here.
 */

// ── useDailyCheckIn ────────────────────────────────────────────────────────────

export interface UseDailyCheckInResult {
  readonly shouldShow: boolean;
  readonly markShown: () => void;
}

// ── useAccountDeletion ──────────────────────────────────────────────────────────

export interface UseAccountDeletionResult {
  readonly isDeleting: boolean;
  readonly handleDeleteAccount: (password: string) => Promise<void>;
}

// ── useHealthData ──────────────────────────────────────────────────────────────

export interface UseHealthDataResult {
  readonly isAvailable: boolean;
  readonly isAuthorized: boolean;
  readonly requestPermissions: () => Promise<void>;
  readonly fetchTodaySteps: () => Promise<number | null>;
  readonly fetchTodayActiveCalories: () => Promise<number | null>;
}

// ── usePartnerSync ─────────────────────────────────────────────────────────────

export interface UsePartnerSyncResult {
  readonly isLinked: boolean;
  readonly partnerName: string | null;
  readonly syncCode: string | null;
  readonly isLoading: boolean;
  readonly linkPartner: (code: string) => Promise<void>;
  readonly unlinkPartner: () => Promise<void>;
  readonly generateCode: () => Promise<void>;
}

// ── useSignedUrl ───────────────────────────────────────────────────────────────

export interface UseSignedUrlResult {
  readonly signedUrl: string | null;
  readonly isLoading: boolean;
  readonly error: Error | null;
}

// ── useImagePicker ─────────────────────────────────────────────────────────────

export interface UseImagePickerResult {
  readonly takePhoto: () => Promise<string | null>;
  readonly pickFromLibrary: () => Promise<string | null>;
}
