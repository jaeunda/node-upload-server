# `node-upload-server`
A file upload API server built with Node.js, TypeScript, and Express. It provides core features for file uploading, listing, and downloading, and is designed to run in a containerized environment via Docker.

## Installation
```bash
$ git clone https://github.com/jaeunda/node-upload-server.git
$ cd node-upload-server
$ npm ci
$ npm run dev
```
- The server is running on `http://localhost:3000` (default).

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
