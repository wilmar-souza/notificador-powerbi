const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

// Variáveis de ambiente
const emailFrom = process.env.EMAIL_FROM;
const emailPass = process.env.EMAIL_PASS;
const emailTo = process.env.EMAIL_TO;

const transporter = nodemailer.createTransport({
  service: 'Outlook', // ou Gmail, se estiver usando Google
  auth: {
    user: emailFrom,
    pass: emailPass
  }
});

app.post('/notificar-erro', async (req, res) => {
  const { mensagem } = req.body;

  try {
    await transporter.sendMail({
      from: `"Notificação Power BI" <${emailFrom}>`,
      to: emailTo,
      subject: 'Erro ao carregar Power BI',
      text: mensagem
    });

    res.status(200).send('E-mail enviado com sucesso.');
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err.message);
    res.status(500).send('Falha ao enviar e-mail.');
  }
});

app.get('/', (req, res) => {
  res.send('Servidor de notificação por e-mail está rodando.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Rodando na porta ${port}`));
