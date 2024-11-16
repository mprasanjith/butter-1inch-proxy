require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const API_BASE_URL = 'https://api.1inch.dev';
const headers = {
  'Authorization': process.env.AUTHORIZATION,
  'Content-Type': 'application/json'
};

app.use(cors());
app.use(express.json());

app.all('*', async (req, res) => {
  try {
    const targetUrl = `${API_BASE_URL}${req.url}`;
    const fetchOptions = {
      method: req.method,
      headers: headers
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    res.status(response.status);

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return res.json(data);
    }

    const text = await response.text();
    return res.send(text);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});