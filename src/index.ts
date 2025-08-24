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

const MAX_FILE_SIZE_BYTES = Number(process.env.MAX_FILE_SIZE_BYTES || 10*1024*1024); 
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => cb(null, file.originalname) 
});
const upload = multer({
    storage: storage,
    limits: {  fileSize: MAX_FILE_SIZE_BYTES  }, // 10MB
    fileFilter: (_req, file, cb) => {
        const filePath = path.join(uploadDir, file.originalname);
        if (fs.existsSync(filePath)){
            return cb(new Error('file_already_exists'));
        }
    },
    preservePath: false
});

// POST /api/upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'no_file' });
    res.json({  filename: req.file.filename, size: req.file.size  });
});

app.get('/api/files', async (_req, res) => {
    try {
        const entries = await fs.promises.readdir(uploadDir);
        const stats = await Promise.all(entries.map(async (name) => {
            const p = path.join(uploadDir, name);
            const st = await fs.promises.stat(p);
            if (!st.isFile()) return null;
            return { name, size: st.size, mtime: st.mtime };
        }));
        res.json(stats.filter(Boolean));
    } catch (e) {
        res.status(500).json({  error: 'list_failed'  });
    }
});

app.use((err: any, req:express.Request, res:express.Response, next:express.NextFunction) => {
    console.error(err);
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'){
        return res.status(400).json({
            error: 'file_too_large',
            message: `File is too large. Limit is ${MAX_FILE_SIZE_BYTES} bytes.`
        })
    }
    if (err.message === 'file_already_exists'){
        return res.status(409).json({
            error: 'file_already_exists',
            message: 'A file with that name already exists.'
        })
    }
    
    res.status(500).json({
        error: 'internal_server_error',
        message: 'An unexpected error occurred.'
    });
});

const PORT =  Number(process.env.PORT || 3000);
app.listen(PORT, () => {
    console.log(`Server up on http://localhost:${PORT}`);
});