import { type ModelProvider } from "@/lib/ai/models";

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
	handleSaveKey: (provider: ModelProvider) => Promise<void>;
	handleCopyKey: (provider: ModelProvider) => Promise<void>;
	toggleShowKey: (provider: ModelProvider) => void;
	handleKeyChange: (provider: ModelProvider, value: string) => void;
}
