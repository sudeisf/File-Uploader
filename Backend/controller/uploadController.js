const fs = require('fs');
const Sstorage = require('../config/supabase');

const uploadFile = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send('Please upload a file');
        }

        const fileContent = fs.readFileSync(file.path);

        const { data, error } = await Sstorage.from('files').upload(
            'files/' + file.originalname,
            fileContent
        );

        if (error) {
            console.error('Supabase upload error:', error.message);
            return res.status(400).send('File upload failed. Please try again later.');
        }

        await fs.promises.unlink(file.path).catch((err) => {
            console.error('Failed to delete local file:', err);
        });

        return res.status(200).send({
            message: 'File uploaded successfully',
            data,
        })
        
    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
};

module.exports = uploadFile; // CommonJS syntax for export
