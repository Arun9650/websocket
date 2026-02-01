import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000;

// JSON middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
	res.send('Express server is running');
});

// Start server and log URL
const server = app.listen(PORT, () => {
	const url = `http://localhost:${PORT}`;
	console.log(`Server running at ${url}`);
});
