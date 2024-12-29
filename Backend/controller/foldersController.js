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

            const { data, error } = await storage.createBucket(folder.name, {
                public: true, 
            });
    
            if (error) {    
                console.error('Supabase create bucket error:', error.message);
                return res.status(400).send('Failed to create folder');
            }
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
                const buckname = folder.name;
                console.log(`Fetching files for bucket: ${buckname}`);

                try {
                    // Fetch the files from the specified bucket
                    const { data, error } = await storage
                        .from(buckname)
                        .list('', { limit: 100 });

                    if (error) {
                        console.error('Error fetching files:', error.message);
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

                    // If no files are returned, log and return empty files
                    if (!data || data.length === 0) {
                        console.log(`No files found in bucket: ${buckname}`);
                        return {
                            ...folder,
                            files: [],
                        };
                    }

                    // Optionally sort the files by name (or any other criteria)
                    const sortedFiles = data.sort((a, b) => a.name.localeCompare(b.name));

                    return {
                        ...folder,
                        files: sortedFiles,
                    };

                } catch (error) {
                    console.error('Error processing bucket:', error.message);
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
    updateFolder
}; 