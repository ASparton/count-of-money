import express from "express";

const app = express();

app.use(express.json());

app.get("/status", (req, res) => {
	res.send({ healthy: true });
});

const PORT = 3000;

const server = app.listen(PORT, () =>
	console.log(`🚀 Server ready at: http://localhost:${PORT}`),
);
