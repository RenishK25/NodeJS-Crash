// const http = require('http');
// const fs = require('fs');
// const XLSX = require('xlsx');
// const { parse } = require('querystring');

import http from 'http';
// import { readFile, writeFile } from 'fs/promises';
import fs from 'fs';
import { parse } from 'querystring';
import XLSX from 'xlsx'
const PORT = 3000;

// Read the Excel file
function readExcelFile() {
  const workbook = XLSX.readFile('./user.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  console.log(worksheet);
  return worksheet;
}

// Write data back to the Excel file
function writeExcelFile(data) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, './user.xlsx');
}

// Handle GET requests
function handleGetRequest(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[2];

  if (urlParts[1] === 'users') {
    const users = readExcelFile();

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
function handlePostRequest(req, res) {
  if (req.url === '/users') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newUser = JSON.parse(body);
      const users = readExcelFile();
      newUser.id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      users.push(newUser);
      writeExcelFile(users);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

// Handle PUT requests
function handlePutRequest(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[2];

  if (urlParts[1] === 'users' && id) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const updatedUser = JSON.parse(body);
      const users = readExcelFile();
      const index = users.findIndex(u => u.id == id);

      if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
        writeExcelFile(users);
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
function handleDeleteRequest(req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[2];

  if (urlParts[1] === 'users' && id) {
    let users = readExcelFile();
    const newUsers = users.filter(u => u.id != id);

    if (newUsers.length !== users.length) {
      writeExcelFile(newUsers);
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