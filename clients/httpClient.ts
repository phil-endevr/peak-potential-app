export default class HttpClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "https://peakpotential.world/api";
  }

  async get(url: string, headers: Record<string, string> = {}) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    return response.json();
  }

  async post(
    url: string,
    body: Record<string, any>,
    headers: Record<string, string> = {}
  ) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }
}
