import * as https from "node:https";
import * as http from "node:http";
import type { WrappedPayload } from "./compute.js";

const DEFAULT_API_URL = "https://ccwrapped.com/api/wrapped";

interface UploadResult {
  slug: string;
}

export function uploadPayload(
  payload: WrappedPayload,
  apiUrl?: string
): Promise<UploadResult> {
  const url = new URL(apiUrl ?? DEFAULT_API_URL);
  const body = JSON.stringify(payload);
  const transport = url.protocol === "https:" ? https : http;

  return new Promise((resolve, reject) => {
    const req = transport.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk: Buffer) => {
          data += chunk.toString();
        });
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = JSON.parse(data) as UploadResult;
              if (!parsed.slug) {
                reject(new Error(`API response missing slug: ${data}`));
                return;
              }
              resolve(parsed);
            } catch {
              reject(new Error(`Failed to parse API response: ${data}`));
            }
          } else {
            reject(
              new Error(`API returned status ${res.statusCode ?? "unknown"}: ${data}`)
            );
          }
        });
      }
    );

    req.on("error", (err: Error) => {
      reject(new Error(`Failed to upload: ${err.message}`));
    });

    req.write(body);
    req.end();
  });
}
