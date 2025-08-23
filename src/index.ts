import 'dotenv/config'
import express from 'express'

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({  ok: true, ts: new Date().toISOString()  });
});

const PORT =  Number(process.env.PORT || 3000);
app.listen(PORT, () => {
    console.log('Server up on http://localhost:${PORT}');
});