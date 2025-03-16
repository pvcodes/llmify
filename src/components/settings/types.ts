import { ModelProviderType } from "@/lib/ai/models";

export interface APIKeyStatus {
	[key: string]: "saved" | "copied" | "error" | null;
}

export interface APIKeyState {
	tempKeys: Record<string, string>;
	displayKeys: Record<string, string>;
	showKey: Record<string, boolean>;
	status: APIKeyStatus;
}

export interface APIKeyActions {
	handleSaveKey: (provider: ModelProviderType) => Promise<void>;
	handleCopyKey: (provider: ModelProviderType) => Promise<void>;
	toggleShowKey: (provider: ModelProviderType) => void;
	handleKeyChange: (provider: ModelProviderType, value: string) => void;
}
