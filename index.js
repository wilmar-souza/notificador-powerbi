const express = require('express');
const sgMail = require('@sendgrid/mail');
const app = express();
app.use(express.json());

// Variáveis de ambiente
const sendgridApiKey = process.env.SENDGRID_API_KEY;
const emailFrom = process.env.EMAIL_FROM;
const emailTo = process.env.EMAIL_TO;

sgMail.setApiKey(sendgridApiKey);

app.post('/notificar-erro', async (req, res) => {
  const { mensagem } = req.body;

  const msg = {
    to: emailTo,
    from: { email: emailFrom }, // Correção aqui
    subject: '🚨 Erro no Power BI',
    text: mensagem,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send('E-mail enviado com sucesso via SendGrid.');
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err.response?.body || err.message);
    res.status(500).send('Falha ao enviar e-mail.');
  }
});

app.get('/', (req, res) => {
  res.send('Servidor de notificação via SendGrid rodando!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Rodando na porta ${port}`));
