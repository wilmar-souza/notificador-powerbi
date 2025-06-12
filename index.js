const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
const app = express();
app.use(express.json());

// ENV: EMAIL, SENHA E WEBHOOK
const emailFrom = process.env.EMAIL_FROM;
const emailPass = process.env.EMAIL_PASS;
const emailTo = process.env.EMAIL_TO;
const webhookTeams = process.env.TEAMS_WEBHOOK;

const transporter = nodemailer.createTransport({
  service: 'Outlook',
  auth: {
    user: emailFrom,
    pass: emailPass
  }
});

app.post('/notificar-erro', async (req, res) => {
  const { mensagem } = req.body;

  try {
    // Enviar Teams
    await axios.post(webhookTeams, { text: `🚨 ${mensagem}` });

    // Enviar Email
    await transporter.sendMail({
      from: `"Notificação Power BI" <${emailFrom}>`,
      to: emailTo,
      subject: 'Erro ao carregar Power BI',
      text: mensagem
    });

    res.status(200).send('Notificações enviadas.');
  } catch (err) {
    console.error('Erro ao enviar notificações:', err.message);
    res.status(500).send('Falha ao notificar.');
  }
});

app.get('/', (req, res) => {
  res.send('Servidor de Notificação Power BI rodando!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Rodando na porta ${port}`));
