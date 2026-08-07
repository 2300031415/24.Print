const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const logger = require('./logger');

/**
 * Extracts total page count from a PDF file on disk.
 * @param {string} filePath - Absolute path to PDF file.
 * @returns {Promise<number>} - Page count.
 */
async function getPdfPageCount(filePath) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();
        return pageCount > 0 ? pageCount : 1;
    } catch (err) {
        logger.warn(`Failed to parse PDF page count with pdf-lib (${err.message}). Defaulting to 1 page.`);
        return 1;
    }
}

module.exports = {
    getPdfPageCount
};
