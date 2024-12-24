const fs = require('fs');
const Sstorage = require('../config/supabaseConfig');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const uploadFile = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send('Please upload a file');
        }

        // Optional: Check if a folderId was provided
        const folderId = req.body.folderId || null; // Use the provided folder ID or null

        const createdFile = await prisma.file.create({
            data: {
                name: file.originalname,
                size: file.size,
                folder: folderId ? { connect: { id: folderId } } : undefined, // Provide folderId (can be null)
                url: "abcd/xyz", // URL will be updated after uploading to storage
            },
        });

        // Read the file content
        const fileContent = fs.readFileSync(file.path);

        // Upload to Supabase
        const { data, error } = await Sstorage.from('files').upload(
            'files/' + file.originalname,
            fileContent
        );

        if (error) {
            console.error('Supabase upload error:', error.message);
            return res.status(400).send('File upload failed. Please try again later.');
        }

        // Update the file URL in the database
        await prisma.file.update({
            where: { id: createdFile.id },
            data: { url: data.path }, // Use the returned path from Supabase
        });

        // Remove the local file
        await fs.promises.unlink(file.path).catch((err) => {
            console.error('Failed to delete local file:', err);
        });

        return res.status(200).send({
            message: 'File uploaded successfully',
            data,
        });
    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
};

const getFile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).send('Unauthorized');
        }

             
        const { fileId } = req.params;

        const file = await prisma.file.findUnique({
            where: {
                id: fileId,
                user_id: user.id,  
            },
        });

        if (!file) {
            return res.status(404).send('File not found');
        }
         
      
        const { data: foldersData, error: folderError } = await Sstorage.from(file.folderId).list('', { limit: 100 });
        if (folderError) {
            console.error('Supabase folder list error:', folderError.message);
            return res.status(400).send('Failed to fetch folders');
        }

        const folder = foldersData.find(f => f.name === file.folderId); 
        
        if (!folder) {
            return res.status(404).send('Folder not found');
        }

        return res.status(200).json({
            file,
            folder,
        });

    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
};

module.exports = {uploadFile, getFile}; // CommonJS syntax for export
