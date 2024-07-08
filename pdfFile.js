const http = require('http');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const PORT = 3000;

const PDF_PATH = './user.pdf';

// Read users from PDF
async function readPdfFile() {
  const existingPdfBytes = fs.readFileSync(PDF_PATH);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { text: textContent } = await firstPage.getTextContent();
  
  const users = textContent.split('\n').map((line, index) => {
    const [id, name, email] = line.split(', ');
    return { id: Number(id), name, email };
  });

  console.log(users);
  return users;
}

// Write users to PDF
async function writePdfFile(users) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const { height } = page.getSize();
  
  users.forEach((user, idx) => {
    page.drawText(`${user.id}, ${user.name}, ${user.email}`, {
      x: 50,
      y: height - 50 - idx * 20,
      size: 12,
      color: rgb(0, 0, 0)
    });
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(PDF_PATH, pdfBytes);
}

// Handle GET requests
async function handleGetRequest(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[2];

  if (urlParts[1] === 'users') {
    const users = await readPdfFile();

    if (id) {
      const user = users.find(u => u.id == id);
      if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('User not found');
      }
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

// Handle POST requests
async function handlePostRequest(req, res) {
  if (req.url === '/users') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const newUser = JSON.parse(body);
      const users = await readPdfFile();
      newUser.id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      users.push(newUser);
      await writePdfFile(users);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

// Handle PUT requests
async function handlePutRequest(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[2];

  if (urlParts[1] === 'users' && id) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const updatedUser = JSON.parse(body);
      const users = await readPdfFile();
      const index = users.findIndex(u => u.id == id);

      if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
        await writePdfFile(users);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users[index]));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('User not found');
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

// Handle DELETE requests
async function handleDeleteRequest(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[2];

  if (urlParts[1] === 'users' && id) {
    let users = await readPdfFile();
    const newUsers = users.filter(u => u.id != id);

    if (newUsers.length !== users.length) {
      await writePdfFile(newUsers);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('User deleted');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('User not found');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

// Create the HTTP server
const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      handleGetRequest(req, res);
      break;
    case 'POST':
      handlePostRequest(req, res);
      break;
    case 'PUT':
      handlePutRequest(req, res);
      break;
    case 'DELETE':
      handleDeleteRequest(req, res);
      break;
    default:
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
