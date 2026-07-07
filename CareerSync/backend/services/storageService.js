const fs = require('fs');
const path = require('path');

function sanitizeFileName(originalName = '') {
  const ext = path.extname(originalName || '').toLowerCase();
  const base = path.basename(originalName || 'resume', ext).replace(/[^a-zA-Z0-9-_]/g, '_') || 'resume';
  return `${base}${ext}`;
}

class LocalStorageService {
  constructor(baseDir) {
    this.baseDir = baseDir;
    fs.mkdirSync(this.baseDir, { recursive: true });
  }

  async saveFile(uploadedFile) {
    if (!uploadedFile?.path) {
      throw new Error('No uploaded file path provided.');
    }

    const fileName = `${Date.now()}_${sanitizeFileName(uploadedFile.originalname)}`;
    const destinationPath = path.join(this.baseDir, fileName);
    fs.renameSync(uploadedFile.path, destinationPath);

    return {
      filename: fileName,
      absolutePath: destinationPath,
      publicUrl: `${process.env.APP_URL || 'http://localhost:3000'}/uploads/resumes/${fileName}`,
    };
  }
}

function createStorageService() {
  const driver = (process.env.STORAGE_DRIVER || 'local').toLowerCase();
  if (driver !== 'local') {
    throw new Error(`Unsupported storage driver: ${driver}`);
  }

  const baseDir = path.resolve(process.cwd(), process.env.UPLOADS_DIR || 'uploads/resumes');
  return new LocalStorageService(baseDir);
}

module.exports = { LocalStorageService, createStorageService };
