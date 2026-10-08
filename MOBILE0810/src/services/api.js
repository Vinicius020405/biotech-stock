export const BASE_URL = 'http://10.135.60.79:3000/api';

// Função para evitar duplicação de '/api/api' na URL
const getFullUrl = (endpoint) => {
  if (endpoint.startsWith('/api/')) {
    return `http://10.135.60.79:3000${endpoint}`;
  }
  return `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

// Função para tratar respostas e simular a estrutura de erros do Axios
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Erro na requisição: ${response.status}`);
    error.response = { status: response.status, data }; // Compatível com error.response.data
    throw error;
  }

  return { data };
};

const api = {
  get: async (endpoint) => {
    const response = await fetch(getFullUrl(endpoint));
    return handleResponse(response);
  },

  post: async (endpoint, body) => {
    const response = await fetch(getFullUrl(endpoint), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (endpoint, body) => {
    const response = await fetch(getFullUrl(endpoint), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(getFullUrl(endpoint), {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

export default api;