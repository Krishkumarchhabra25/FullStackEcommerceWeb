const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: 'durrngbcc',
    api_key: '863857845592683',
    api_secret: 'aHDXMkVadQs6ict73uf5RHmpfeE'
});
    
const storage = new multer.memoryStorage();

async function ImageUploadUtil(file) {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: 'auto'
        });
        return result;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
}


const upload = multer({ storage }).single('my_file');

module.exports = {upload , ImageUploadUtil};