const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// Servir archivos transpilados desde dist
app.use("/dist", express.static(path.join(__dirname, "dist")));

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ruta para archivos TypeScript transpilados
app.get("/dist/*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", req.params[0]));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
