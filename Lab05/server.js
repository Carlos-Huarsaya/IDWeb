const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'estudiantes.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

