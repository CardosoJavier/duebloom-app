import { User } from "./user";

export interface AuthResponse {
  user: User | null;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  } | null;
}

// ── Auth component Props ───────────────────────────────────────────────────────

export interface AuthContainerProps {
  readonly children: React.ReactNode;
}

export interface SyncInputProps {
  readonly myCode?: string;
  readonly isLoading: boolean;
  readonly onConnect: (code: string) => void;
}

export interface SyncWaitingProps {
  readonly myCode?: string;
  readonly onCancel?: () => void;
}

export interface SyncFoundProps {
  readonly partnerName: string;
  readonly isLoading: boolean;
  readonly isConfirmed: boolean;
  readonly onConfirm: () => void;
}
