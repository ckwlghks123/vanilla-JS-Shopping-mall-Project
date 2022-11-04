import multer from 'multer';
import path from 'path';
import { v4 } from 'uuid';

const DIR = 'uploads/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname.split(' ').join('-'), ext);
        const fileName = basename + '_' + new Date().getTime() + ext;
        cb(null, v4() + '-' + fileName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('png, jpg, jpeg 파일형식만 사용가능합니다'));
        }
    },
});

export { upload };
