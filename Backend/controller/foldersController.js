const{PrismaClient} = require('@prisma/client');
const storage = require('../config/supabaseConfig');
const prisma = new PrismaClient();

const  createFolder = async (req, res) => {
    try {
        const name = req.body.name;
        console.log(name);
        const user = req.user;
        if(!user){
            return res.status(401).send('Unauthorized');
        }
        const exstingFolder = await prisma.folder.findFirst({
            where: {
                name: name,
                userId: user.sub,
            },
        });
        if (exstingFolder) {
            return res.status(400).send('Folder already exists');
        }
        const folder = await prisma.folder.create({
            data: {
                userId: user.sub,
                name: name
            },
        });

        if(folder){

            const placeHolderFile = new Blob(["placeholder file"], { type: 'text/plain' });
            const { data, error } = await storage.from("users-files").upload(
                `${user.sub}/${folder.name}/readme.txt`, placeHolderFile
            );if (error) {    
                console.error('Supabase create bucket error:', error.message);
                return res.status(400).send('Failed to create folder');
            }
            return res.status(200).json({
                success: true,
                message: 'Folder created successfully',
                folderID : folder.id,
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
        if (!user) {
            return res.status(401).send('Unauthorized');
        }

        const folders = await prisma.folder.findMany({
            where: {
                userId: user.id,
            }
        });

        if (!folders || folders.length === 0) {
            return res.status(404).send('No folders found');
        }

        const folderDetails = await Promise.all(
            folders.map(async (folder) => {
                const foldername = folder.name;
                const folderPath = `${user.sub}/${foldername}`.replace(/\/$/, "");
                try {
                    const { data, error } = await storage
                        .from("users-files")
                        .list(folderPath, { limit: 100 , offset : 0,  sortBy: { column: 'name', order: 'asc' }
                        }); 

                    if (error) {
                        console.error(`Error fetching files for folder ${foldername}:`, error.message);
                        return {
                            ...folder,
                            files: [{
                                name: 'error',
                                size: 0,
                                url: 'error',
                                type: 'error',
                            }],
                        };
                    }

                    if (!data || data.length === 0) {
                        console.log(`No files found in folder: ${foldername}`);
                        return {
                            ...folder,
                            files: [],
                        };
                    }

                    const sortedFiles = data.sort((a, b) => a.name.localeCompare(b.name));

                    return {
                        ...folder,
                        files: sortedFiles,
                    };

                } catch (error) {
                    console.error(`Error processing folder ${foldername}:`, error.message);
                    return {
                        ...folder,
                        files: [{
                            name: 'error',
                            size: 0,
                            url: 'error',
                            type: 'error',
                        }],
                    };
                }
            })
        );

        return res.status(200).json(folderDetails);

    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
};

const getFoldersName = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).send('Unauthorized');
        }

        const folders = await prisma.folder.findMany({
            where: {
                userId: user.id,
            },
            select: {
                name: true, // Only select the folder names
            }
        });

        if (!folders || folders.length === 0) {
            return res.status(404).send('No folders found');
        }

        // Only return folder names
        const folderNames = folders.map(folder => folder.name);

        return res.status(200).json(folderNames);

    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
};




const updateFolder = async (req, res) => {    
    try {
        const user = req.user;
        if(!user){
            return res.status(401).send('Unauthorized');
        }    
        const folder = await PrismaClient.folder.update({
            where: {
                id: req.params.id,
            },
            data: {
                name: req.body.name,
            },
        });
        
        const {data: files, error: listError } = await storage.from("users-files").update(`$${user.sub}/${folder.name}`, req.body.name);

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
        const folder = await PrismaClient.folder.findUnique({
            where: {
                id: req.params.id,
            },
        });
        
        // Check if the folder exists and belongs to the user   
        if (!folder || folder.user_id !== user.id) {
            return res.status(404).send('Folder not found or access denied');
        }
        const { data: files, error: listError } = await storage.from('users-files').list('',{ limit: 100 , recursive: true });
        if(listError){
            console.error('Supabase list bucket error:', filesError.message);
            return res.status(400).send('Failed to delete folder');
        }
    
        if(files.length > 0){
            const filePath  = files.map((file) => file.name);
            const {error: deleteFileError}  = await storage.from('users-files').remove();
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

        await PrismaClient.folder.delete({
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
    deleteFolder, 
    updateFolder,
    getFoldersName
}; 