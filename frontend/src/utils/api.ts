// API Config

const API_BASE_URL = ''

// Simple Request
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...((options.headers as Record<string, string>) || {}),
	}

	const response = await fetch(url, {
		...options,
		headers,
	})

	if (!response.ok) {
		const error = await response.json().catch(() => ({ detail: response.statusText }))
		throw new Error(error.detail || `HTTP ${response.status}`)
	}

	if (response.status === 204) {
		return undefined as T
	}

	return response.json()
}

// Custom Task
