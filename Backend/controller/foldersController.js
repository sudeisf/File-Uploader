const{prismaClient} = require('@prisma/client');
const storage = require('../config/supabaseConfig');

const createFolder = async (req, res) => {
    try {
        const { name } = req.body;
        const user = req.user;
        if(!user){
            return res.status(401).send('Unauthorized');
        }
        const exstingFolder = await prismaClient.folder.findFirst({
            where: {
                name: name,
                user_id: user.id,
            },
        });
        if (exstingFolder) {
            return res.status(400).send('Folder already exists');
        }
        const folder = await prismaClient.folder.create({
            data: {
                name: name,
                user_id: user.id,
            },
        });

        const { data, error } = await storage.createBucket(folder.id, {
            public: false, 
        });

        if (error) {    
            console.error('Supabase create bucket error:', error.message);
            return res.status(400).send('Failed to create folder');
        }

        if(folder){
            return res.status(200).json({
                message: 'Folder created successfully',
                folder,
                storageBucket: data, 
            });
        }
        else{
            return res.status(400).send('Failed to create folder');
        }
    }   
    catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
}



const getFolders = async (req, res) => {    
    try {
        const user = req.user;
        if(!user){
            return res.status(401).send('Unauthorized');
        }    
        
        const folders = await prismaClient.folder.findMany({   
            where: {
                user_id: user.id,
            },
        });

        if(!folders || folders.length === 0){
            return res.status(404).send('No folders found');
        }

        const folderDetails = await Promise.all(
            folders.map(async (folder) => {
                const {data, error} = await storage.from('folders').list('',{limit : 100});
                if(error){
                    console.error('Supabase list bucket error:', error.message);
                    return {...folder, files: []};
               }
               return {...folder, files: data};
            })
        )

        return res.status(200).json(folderDetails);
    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
}   

const getFolder = async (req, res) => {    
    try {

        const user = req.user;
        if(!user){
            return res.status(401).send('Unauthorized');
        }    
        const folder = await prismaClient.folder.findUnique({
            where: {
                id: req.params.id,
            },
        });

       // Check if the folder exists and belongs to the user
       if (!folder || folder.user_id !== user.id) {
        return res.status(404).send('Folder not found or access denied');
    }


        const { data, error } = await storage.from(folder.id).list('', {limit: 100});
        if(error){
            console.error('Supabase list bucket error:', error.message);
            return {...folder, files: []};
        }
        const folderDetails = {
            ...folder,
             files: data
            };
        
            
        return res.status(200).json(folderDetails);

    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
}   
``

const updateFolder = async (req, res) => {    
    try {
        const user = req.user;
        if(!user){
            return res.status(401).send('Unauthorized');
        }    
        const folder = await prismaClient.folder.update({
            where: {
                id: req.params.id,
            },
            data: {
                name: req.body.name,
            },
        });
        
        return res.status(200).json(folder);
       
    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
}   



const deleteFolder = async (req, res) => {    
    try{
        const user = req.user;
        if(!user){
            return res.status(401).send('Unauthorized');
        }    
        const folder = await prismaClient.folder.findUnique({
            where: {
                id: req.params.id,
            },
        });
        
        // Check if the folder exists and belongs to the user   
        if (!folder || folder.user_id !== user.id) {
            return res.status(404).send('Folder not found or access denied');
        }
        const { data: files, error: listError } = await storage.from(folder.id).list('', { limit: 100 });
        if(listError){
            console.error('Supabase list bucket error:', filesError.message);
            return res.status(400).send('Failed to delete folder');
        }
    
        if(files.length > 0){
            const filePath  = files.map((file) => file.name);
            const {error: deleteFileError}  = await storage.from(folder.id).remove(filePath);
            if(deleteFileError){
                console.error('Supabase delete file error:', deleteFileError.message);
                return res.status(400).send('Failed to delete folder');
            }
        }  

        const {error: bucketError} = await storage.deleteBucket(folder.id);
        if(bucketError){
            console.error('Supabase delete bucket error:', bucketError.message);
            return res.status(400).send('Failed to delete folder');
        }

        await prismaClient.folder.delete({
            where: {
                id: req.params.id,
            },
        });
        return res.status(200).send('Folder deleted successfully');


    }catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
}   

module.exports = {
    createFolder, 
    getFolders, 
    getFolder, 
    deleteFolder, 
    updateFolder
}; 