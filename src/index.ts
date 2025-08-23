import 'dotenv/config'
import express from 'express'
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({  ok: true, ts: new Date().toISOString()  });
});

const MAX_FILE_SIZE_BYTES = 10*1024*1024;
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => cb(null, file.originalname) // 중복 파일
});
const upload = multer({
    storage: storage,
    limits: {  fileSize: MAX_FILE_SIZE_BYTES  } // 10MB
});

// POST /api/upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'no_file' });
    res.json({  filename: req.file.filename, size: req.file.size  });
});

app.use((err: any, req:express.Request, res:express.Response, next:express.NextFunction) => {
    if (err instanceof multer.MulterError && err.code == 'LIMIT_FILE_SIZE'){
        return res.status(400).json({
            error: 'file_too_large',
            message: `File is too large. Limit is ${MAX_FILE_SIZE_BYTES} bytes.`
        })
    }
    next(err);
});

const PORT =  Number(process.env.PORT || 3000);
app.listen(PORT, () => {
    console.log(`Server up on http://localhost:${PORT}`);
});