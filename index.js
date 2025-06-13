const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const webhookUrl = process.env.TEAMS_WEBHOOK;

app.post('/notificar-erro', async (req, res) => {
  const { mensagem } = req.body;

  const payload = {
    text: mensagem
  };

  try {
    await axios.post(webhookUrl, payload);
    res.status(200).send('Notificação enviada para o Teams.');
  } catch (err) {
    console.error('Erro ao enviar para o Teams:', err.response?.data || err.message);
    res.status(500).send('Falha ao enviar notificação.');
  }
});

app.get('/', (req, res) => {
  res.send('Servidor de notificação via Microsoft Teams rodando!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Rodando na porta ${port}`));
