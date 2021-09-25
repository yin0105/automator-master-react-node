const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const port = process.env.PORT || 5000;

app.use(`/api`, require('./services'));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res, next) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
    console.log("<---> PRODUCTION MODE <--->");
}

server.listen(port, () => console.log(`Server is running on ${port}`));