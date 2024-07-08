const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Read the Excel file
function readExcelFile() {
  const workbook = XLSX.readFile('./user.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return worksheet;
}

// Write data back to the Excel file
function writeExcelFile(data) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, './user.xlsx');
}

// Get all users
app.get('/users', (req, res) => {
  const users = readExcelFile();
  res.json(users);
});

// Get user by ID
app.get('/users/:id', (req, res) => {
  const users = readExcelFile();
  const user = users.find(u => u.id == req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// Create new user
app.post('/users', (req, res) => {
  const users = readExcelFile();
  const newUser = req.body;
  newUser.id = users.length ? Math.max(users.map(u => u.id)) + 1 : 1;
  users.push(newUser);
  writeExcelFile(users);
  res.status(201).json(newUser);
});

// Update user
app.put('/users/:id', (req, res) => {
  const users = readExcelFile();
  const index = users.findIndex(u => u.id == req.params.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    writeExcelFile(users);
    res.json(users[index]);
  } else {
    res.status(404).send('User not found');
  }
});

// Delete user
app.delete('/users/:id', (req, res) => {
  let users = readExcelFile();
  const newUsers = users.filter(u => u.id != req.params.id);
  if (newUsers.length !== users.length) {
    writeExcelFile(newUsers);
    res.send('User deleted');
  } else {
    res.status(404).send('User not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
