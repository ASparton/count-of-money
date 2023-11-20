import express from "express";

import auth from "@controllers/auth";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/status", (_, res) => {
	res.send({ healthy: true });
});

app.use("/api/auth/", auth);

app.listen(PORT, () =>
	console.log(`🚀 Server ready at: http://localhost:${PORT}`),
);
