const http = require('http');

const port = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
});

server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
