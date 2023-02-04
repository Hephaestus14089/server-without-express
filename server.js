const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const port = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
  try {
    const data = await fsPromises.readFile(filePath, 'utf8');
    response.writeHead(200, {'Content-Type': contentType});
    response.end(data);
  } catch (err) {
    console.log(err);
    response.statusCode = 500;
    response.end();
  }
}

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  const extension = path.extname(req.url);
  let contentType = '';

  switch (extension) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.txt':
      contentType = 'text/plain';
      break;
    default:
      contentType = 'text/html';
  } // end of switch statement

  let filePath =
        contentType === 'text/html' && req.url === '/'
        ? path.join(__dirname, 'views', 'index.html')
        : contentType === 'text/html' && req.url.slice(-1) === '/'
        ? path.join(__dirname, 'views', req.url, 'index.html')
        : contentType === 'text/html'
        ? path.join(__dirname, 'views', req.url)
        : path.join(__dirname, req.url);

  if (!extension && req.url.slice(-1) !== '/')
    filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  if (fileExists)
    serveFile(filePath, contentType, res);
  else
    serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);

  // switch (req.url) {
  //   case 'index.html': // fall through to next immediate case
  //   case '/': {
  //     res.statusCode = 200;
  //   }
  //     break;
  // } // end of switch statement
});

server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
