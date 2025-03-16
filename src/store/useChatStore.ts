"use client";
import { type ModelProviderType, type Models } from "@/lib/ai/models";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Derive a persistent AES CryptoKey using PBKDF2
const deriveCryptoKey = async (): Promise<CryptoKey> => {
	const passphrase = "persistent-secret"; // Can be user-defined
	const encoder = new TextEncoder();
	const salt = encoder.encode("unique-salt"); // Can be stored in IndexedDB if needed
	const baseKey = await crypto.subtle.importKey(
		"raw",
		encoder.encode(passphrase),
		{ name: "PBKDF2" },
		false,
		["deriveKey"]
	);
	return await crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt,
			iterations: 100000,
			hash: "SHA-256",
		},
		baseKey,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"]
	);
};

// Encrypt data with AES-GCM
const encrypt = async (text: string, key: CryptoKey): Promise<string> => {
	if (!text) return "";
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const encodedText = new TextEncoder().encode(text);
	const encrypted = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		key,
		encodedText
	);
	const encryptedArray = new Uint8Array(encrypted);
	const result = new Uint8Array(iv.length + encryptedArray.length);
	result.set(iv);
	result.set(encryptedArray, iv.length);
	return btoa(String.fromCharCode(...result));
};

// Decrypt data with AES-GCM
const decrypt = async (cipherText: string, key: CryptoKey): Promise<string> => {
	if (!cipherText) return "";
	try {
		const data = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));
		const iv = data.slice(0, 12);
		const encryptedData = data.slice(12);
		const decrypted = await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv },
			key,
			encryptedData
		);
		return new TextDecoder().decode(decrypted);
	} catch (error) {
		console.error("Decryption failed:", error);
		return "";
	}
};

// Zustand Store Interface
interface ChatState {
	config: {
		provider: ModelProviderType | null;
		model: { label: string; value: Models<ModelProviderType> } | null;
	} | null;
	apiKeys: Partial<Record<ModelProviderType, string>>; // Encrypted in storage
	cryptoKey: CryptoKey | null;
	setConfig: (
		provider: ModelProviderType,
		model: { label: string; value: Models<ModelProviderType> }
	) => void;
	setApiKey: (provider: ModelProviderType, apiKey: string) => Promise<void>;
	getApiKey: (provider: ModelProviderType) => Promise<string | undefined>;
	initializeCryptoKey: () => Promise<void>;
}

// Zustand Store
const useChatStore = create<ChatState>()(
	devtools(
		persist(
			(set, get) => ({
				config: null,
				apiKeys: {},
				cryptoKey: null,

				setConfig: (provider, model) =>
					set({ config: { provider, model } }),

				setApiKey: async (provider, apiKey) => {
					const cryptoKey = get().cryptoKey;
					if (!cryptoKey) {
						console.error("Crypto key not initialized");
						return;
					}
					const encryptedKey = apiKey
						? await encrypt(apiKey, cryptoKey)
						: undefined;
					set((state) => ({
						apiKeys: { ...state.apiKeys, [provider]: encryptedKey },
					}));
				},

				getApiKey: async (provider) => {
					const cryptoKey = get().cryptoKey;
					if (!cryptoKey) return undefined;
					const encryptedKey = get().apiKeys[provider];
					return encryptedKey
						? await decrypt(encryptedKey, cryptoKey)
						: undefined;
				},

				initializeCryptoKey: async () => {
					const key = await deriveCryptoKey();
					set({ cryptoKey: key });
				},
			}),
			{
				name: "chat-store",
				partialize: (state) => ({
					config: state.config,
					apiKeys: state.apiKeys,
				}),
				onRehydrateStorage: () => (state) => {
					if (state) {
						state.initializeCryptoKey();
					}
				},
			}
		)
	)
);

export default useChatStore;
