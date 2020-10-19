import fs from 'fs';
import multer from 'multer';

const uploadPDF = multer({
  dest: 'uploads',
  limits: { files: 1, fieldSize: 10485760 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error(
          JSON.stringify({
            status: 400,
            error: `The file '${file.originalname}' is not in PDF format.`,
          })
        )
      );
    }
  },
});

const renameFile = (reqFile, cpf) => {
  if (reqFile) {
    //load request file fields
    const { path, filename, originalname } = reqFile;

    //sets new name of file
    let newName = `${cpf}_${new Date().toISOString()}`;
    newName = newName.replace(/[^\d_]+/g, '');
    newName += originalname.substr(originalname.lastIndexOf('.')).toLowerCase();

    //rename file path with new name
    const newPath = path.replace(filename, newName);
    fs.renameSync(path, newPath);

    //update request file
    reqFile.path = newPath;
    reqFile.filename = newName;
    return reqFile;
  }
};

const deleteFile = (reqFile) => {
  if (reqFile && fs.existsSync(reqFile.path)) {
    fs.unlinkSync(reqFile.path);
  }
};

export { uploadPDF, renameFile, deleteFile };
