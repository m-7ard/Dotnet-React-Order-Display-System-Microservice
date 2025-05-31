import fetch, { RequestInit, Response } from "node-fetch";

async function fetchWithRetry(url: string, options: RequestInit = {}, retries: number = 3, delay: number = 1000): Promise<Response> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await fetch(url, { ...options });
            
            if (res.ok) {
                return res;
            }

            throw new Error(`HTTP error ${res.status}`);
        } catch (err) {
            console.warn(`Attempt ${attempt} failed: ${(err as Error).message}`);
            if (attempt === retries) throw err;
            await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        }
    }

    throw new Error("Unreachable");
}

export default fetchWithRetry;
