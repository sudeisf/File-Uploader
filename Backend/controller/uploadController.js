const Sstorage = require('../config/supabaseConfig');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
const { Readable } = require('stream');

const path = require('path');
const fs = require('fs');




const pathToKey = path.join(__dirname, '../utils/', 'private.pem');
console.log(pathToKey);
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');


const uploadFile = async (req, res) => {
    const { folderID,  folder } = req.body;
    const user = req.user;
    const file = req.file;

    try {
     
        if (!user) {
            return res.status(401).send('Unauthorized');
        }

      
        if (!file) {
            return res.status(400).send('Please upload a file');
        }

       
        let folderName = folder || "public";

        let folderRecord = await prisma.folder.findFirst({
            where: {
                name: folderName,
                userId: user.sub,
            },
        });

        if (!folderRecord) {
            folderRecord = await prisma.folder.create({
                data: {
                    name: folderName,
                    userId: user.sub,
                },
            });
        }
       


        const fileContent = fs.readFileSync(file.path);;
        const { data, error } = await Sstorage.from("users-files").upload(
            `${user.sub}/${folderName}/${file.originalname}`,
            fileContent,
            {
                contentType: file.mimetype,
            }
        );

        const supabaseFileid = data.id;

      
        if (error) {
            console.error('Supabase upload error:', error.message);
            return res.status(400).send(`${error.message}`);
        }

        // const fileId = uuidv4();

        await prisma.file.create({
            data: {
                uid: supabaseFileid,
                folderId: folderRecord.id, // Store the ID of the folder
                name: file.originalname,
                url: data.path, // Supabase URL
                userId: user.sub, // User ID
                size: parseInt(file.size, 10), // File size
            },
        });

        
        await fs.promises.unlink(file.path).catch((err) => {
            console.error('Failed to delete local file:', err);
        });

        // Step 5: Return success response
        return res.status(200).send({
            message: 'File uploaded successfully',
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

             
        const { fileUid } = req.params;

        const file = await prisma.file.findUnique({
            where: {
                uid: fileUid,
                userId: user.id,  
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



const deleteFile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).send('Unauthorized');
        }

        const { folderName, fileUid } = req.params;
        const uid = String(fileUid);
        
        const folder = await prisma.folder.findFirst({
            where: {
                name: folderName,
                userId: user.id,
            },
        });
        
        if (!folder) {
            return res.status(404).send('Folder not found');
        }

        const file = await prisma.file.findFirst({
            where: {
                uid: uid,
                folderId: folder.id,
                userId: folder.userId,
            },
        });
        if (!file) {
            return res.status(404).send('File not found');
        }
        
        const { data, error } = await Sstorage.from("users-files").remove([file.url]);
        if (error) {
            console.error('Supabase delete error:', error.message);
            return res.status(400).send('Failed to delete file');
        }
        if(data){
            await prisma.file.delete({
                where: {
                    id: file.id,
                userId: user.id,
            },
        }); 
        return res.status(200).send('File deleted successfully');   
        }

        
        
    } catch (error) {

        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
}

const downloadFile = async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).send('Unauthorized');
      }
    
      const { folderName, fileUid } = req.params;
      const uid = String(fileUid);
      
      const folder = await prisma.folder.findFirst({
        where: {
          name: folderName,
          userId: user.sub,
        },
      });
      
      if (!folder) {
        return res.status(404).send('Folder not found');
      }
  
      const file = await prisma.file.findFirst({
        where: {
          uid: uid,
          folderId: folder.id,
          userId: folder.userId,
        },
      });
      if (!file) {
        return res.status(404).send('File not found');
      }
  
      const { data, error } = await Sstorage.from("users-files").download(file.url);
      if (error) {
        console.error('Supabase download error:', error.message);
        return res.status(400).send('Failed to download file');
      }
      console.log(data)
  
      if (!data || data.size === 0) {
        return res.status(400).send('File is empty or invalid');
      }
  
      const arrayBuffer = await data.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length === 0) {
        return res.status(400).send('File buffer is empty');
      }


    const fileStream = Readable.from(buffer);
    const originalName = decodeURIComponent(file.name.trim());

    // Replace multiple underscores or unwanted characters with safe alternatives
    const safeName = originalName
      .replace(/\s+/g, ' ')                // Convert multiple spaces to single space
      .replace(/[^a-zA-Z0-9.\-_\s]/g, '')  // Remove characters except a-z, A-Z, 0-9, dot, dash, underscore, and space
      .replace(/_+/g, '_');   
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
      console.log(file.name)
      res.setHeader('Content-Length', file.size);
      console.log(file.name , file.size)
      fileStream.on('error', (streamError) => {
        console.error('Stream error:', streamError.message);
        if (!res.headersSent) {
          res.status(500).send('Failed to stream file');
        }
      });
  
      fileStream.pipe(res);
  
    } catch (error) {
      console.error('Internal server error:', error.message);
      if (!res.headersSent) {
        res.status(500).send('Internal server error');
      }
    }
  };
module.exports = {uploadFile, getFile, deleteFile , downloadFile}; // CommonJS syntax for export
