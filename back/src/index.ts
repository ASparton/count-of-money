import express from 'express';

import auth from '@controllers/auth';
import articles from '@controllers/articles';

const PORT = 3000;
const app = express();

app.use(express.json());

app.get('/status', (req, res) => {
	res.send({ healthy: true });
});

app.use('/api/auth/', auth);
app.use('/api/articles', articles);

app.listen(PORT, () =>
	console.log(`🚀 Server ready at: http://localhost:${PORT}`),
);
