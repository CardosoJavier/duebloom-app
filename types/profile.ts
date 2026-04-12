/**
 * Props interfaces for /components/profile/ components.
 */

// ── EditProfileModalProps ──────────────────────────────────────────────────────

export interface EditProfileModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

// ── AppSettingsModalProps ──────────────────────────────────────────────────────

export interface AppSettingsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

// ── DeleteAccountModalProps ────────────────────────────────────────────────────

export interface DeleteAccountModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly inputCode: string;
  readonly onInputChange: (value: string) => void;
  readonly canDelete: boolean;
  readonly isDeleting: boolean;
  readonly onConfirm: () => void;
}
