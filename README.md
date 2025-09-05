# `node-upload-server`
A file upload API server built with Node.js, TypeScript, and Express. It provides core features for file uploading, listing, and downloading, and is designed to run in a containerized environment via Docker.

## Getting Started
### Prerequisites
- Node.js (LTS version)
- Docker

### Installation
```bash
$ git clone https://github.com/jaeunda/node-upload-server.git
$ cd node-upload-server
$ npm ci
$ npm run dev
```
- The server is running on `http://localhost:3000` (default).

### Docker
```
$ docker build -t node-upload-server .
$ docker run --rm -d -p 3000:3000 -v "$(pwd)/uploads:/app/uploads" --name upload-api node-upload-server
```

## API Endpoints
### Health Check
- `GET /health`
### File Upload
- `POST /api/upload`
    - field name: `file`
    - limits: 10MB (file size)
### File List
- `GET /api/files`
### File Download
- `GET /files/:name`
