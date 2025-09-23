import { client } from "../api/client.gen";

export function setApiToken(token: string | null) {
  if (token) {
    client.setConfig({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    clearApiToken();
  }
}

export function clearApiToken() {
  client.setConfig({
    headers: {},
  });
}

export function getApiClient() {
  return client;
}
