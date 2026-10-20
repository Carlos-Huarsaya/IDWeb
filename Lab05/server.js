const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'estudiantes.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};
const server = http.createServer((req, res) => {
  const { method, url } = req;
 
  if (url === '/api/estudiantes' && method === 'GET') {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'Error interno al leer los datos' }));
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(data || '[]');
    });
    return;
  }


  if (url === '/api/estudiantes' && method === 'POST') {
    let body = '';


    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const nuevoEstudiante = JSON.parse(body);

        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
          let estudiantes = [];

          if (!err && data) {
            try {
              estudiantes = JSON.parse(data);
            } catch (parseErr) {
              estudiantes = [];
            }
          }

   
          if (!nuevoEstudiante.id) {
            nuevoEstudiante.id = Date.now();
          }

          estudiantes.push(nuevoEstudiante);

          
          fs.writeFile(DATA_FILE, JSON.stringify(estudiantes, null, 2), (writeErr) => {
            if (writeErr) {
              res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
              return res.end(JSON.stringify({ error: 'Error al guardar los datos' }));
            }

            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(nuevoEstudiante));
          });
        });
      } catch (parseError) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'El formato del body debe ser JSON válido' }));
      }
    });
    return;
  }


  if (url.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ error: 'Ruta de la API no encontrada' }));
  }

  const relativePath = url === '/' ? 'index.html' : url;
  const filePath = path.join(PUBLIC_DIR, relativePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ error: 'Acceso denegado' }));
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Recurso estático no encontrado' }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Error interno al cargar el recurso' }));
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor HTTP nativo escuchando en http://localhost:${PORT}`);
});