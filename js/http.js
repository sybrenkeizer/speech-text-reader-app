class HTTP {
	async get(url) {
		const response = await fetch(url);
		const responseData = await response.json();
		return responseData;
	}

	async post(url, data) {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		const responseData = await response.json();
		return responseData;
	}
}

export const http = new HTTP;
