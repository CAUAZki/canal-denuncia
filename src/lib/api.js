export async function api(path, { method = 'GET', body, signal } = {}) {
  const options = { method, credentials: 'include', signal, headers: {} };

  if (body instanceof FormData) {
    options.body = body;
  } else if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`/api${path}`, options);
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.error || 'Não foi possível concluir a operação.');
    error.status = response.status;
    error.fields = data?.fields || null;
    throw error;
  }

  return data;
}
