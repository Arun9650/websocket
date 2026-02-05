import express from 'express';
import { matchRouter } from './routes/matches.js';

const app = express();
const PORT = process.env.PORT || 8000;

// JSON middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
	res.send('Express server is running');
});

app.use('/matches', matchRouter);

// Start server and log URL
 app.listen(PORT, () => {
	const url = `http://localhost:${PORT}`;
	console.log(`Server running at ${url}`);
});
