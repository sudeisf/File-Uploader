
const Sstorage = require('../config/supabaseConfig');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const path = require('path');
const fs = require('fs');
const { Int32 } = require('bson');


const pathToKey = path.join(__dirname, '../utils/', 'private.pem');
console.log(pathToKey);
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');


const uploadFile = async (req, res) => {
    const reqObj = {
        id : req.folderID,
        fileD : req.file,
        folder : req.folder
    }

    console.log(req.reqObj)
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).send('Unauthorized');
        }
        const file = req.file; 
        if (!file) {
            return res.status(400).send('Please upload a file');
        }
        const folderName = req.body.folder; 
        const fileContent = fs.readFileSync(file.path);
        const { data, error } = await Sstorage.from("users-files").upload(
            `${user.sub}/${folderName}/${file.originalname}`, // Ensure proper path,
            fileContent
        );


        if (error) {
            console.error('Supabase upload error:', error.message);
            return res.status(400).send('File upload failed. Please try again later.');
        }
        const userID = JSON.stringify(user.sub);
        const folderID = JSON.stringify(req.folderID)
        await prisma.file.create({
            data: {
              folderId: folderID ? { connect: { id: folderID } } : undefined,
              url: data.path,
              userId:user.sub,
              size: parseInt(file.size,10)
               // directly use user.sub as a string
            },
          });
          

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
