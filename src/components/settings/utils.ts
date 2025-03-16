export const validateApiKey = async (provider: string, apiKey: string) => {
	try {
		const response = await fetch(`/api/validate-api-key`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ provider, apiKey }),
		});
		if (!response.ok) throw new Error("Invalid API key");
		const { valid } = await response.json();
		return valid;
	} catch (error) {
		console.error(`Validation failed for ${provider}:`, error);
		return false;
	}
};
