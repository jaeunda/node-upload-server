import { Router } from "express";
import fs from "fs";
import path from "path";

const r = Router();
const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');

r.get('/', async (_req, res) => {
    try {
        const entries = await fs.promises.readdir(uploadDir);
        const stats = await Promise.all(entries.map(async (name) => {
            const p = path.join(uploadDir, name);
            const st = await fs.promises.stat(p);
            if (!st.isFile) return null;
            return {  name, size: st.size, mtime: st.mtime };
        }));
        res.json(stats.filter(Boolean));
    } catch (e){
        res.status(500).json({  error: 'list_failed'  });
    }
});
r.get('/:name', (req, res) => {
    const p = path.join(uploadDir, req.params.name);
    if (!fs.existsSync(p)){
        return res.status(404).json({
            error: 'file_not_found',
            message: 'File does not exist.'
        });
    } else {
        res.download(p);
    }
});

export default r;