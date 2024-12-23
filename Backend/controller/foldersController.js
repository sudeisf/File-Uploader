const{prismaClient} = require('../prisma/client');
const storage = require('../config/supabaseConfig');
const fs = require('fs');
const { ModuleKind } = require('typescript');




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

        if(folder){
            return res.status(200).json(folder);
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
        if(!folders){
            return res.status(404).send('Folders not found');
        }
        return res.status(200).json(folders);
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
        return res.status(200).json(folder);
    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
}   


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
    try {
        const user = req.user;
        if(!user){
            return res.status(401).send('Unauthorized');
        }    
        const folder = await prismaClient.folder.delete({
            where: {
                id: req.params.id,
            },
        });
        return res.status(200).json(folder);
    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).send('Internal server error');
    }
}   



Module.exports = {createFolder, getFolders, getFolder, deleteFolder, updateFolder}; // CommonJS syntax for export