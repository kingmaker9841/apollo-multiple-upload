const fs = require('fs');
const {v4: uuid} = require('uuid');
const s3 = require('./s3');

let uploadProcess = async (file)=>{
    let {createReadStream, filename, mimetype, encoding} = await file;
    let stream = createReadStream();
    let path = "uploads/" + uuid() + filename;
    return new Promise((resolve,reject)=>
        stream
        .on("error", (error)=>{
            if (error) fs.unlinkSync(path);
            reject({
                success: false,
                message: "Some Error"
            });
        })
        .pipe(fs.createWriteStream(path))
        .on("finish", ()=> {
            resolve({
                filename, mimetype, encoding, location: path,
                success: true, message: "Successfully Uploaded!"
            })
        })
    )
}

let uploadProcessToS3 = async (file) =>{
    let {createReadStream, mimetype, filename, encoding} = await file;
    let stream = createReadStream();
    let upload = await s3.upload({
        Body: stream,
        Key: `${uuid()}${filename}`,
        ContentType: mimetype
    }).promise();
    return {
        filename, mimetype, encoding, location: upload.Location
    }
}
//Mime type check
let typeCheck = async (item)=>{
    let {mimetype} = await item;
    if(!(mimetype === "image/png" || mimetype === "image/jpeg")){
        return false;
    }else{
        return true;
    }
}

const resolvers = {
    Mutation: {
        singleUpload : async (_, args)=>{
            let t = await typeCheck(args.file);
            if (t){
                return uploadProcess(args.file);
            }else{
                return {
                    success: false,
                    message: "Type Error"
                }
            }
            
        },
        multipleUpload : async (_, args)=>{
            let arrObj = (await Promise.all(args.files)).map(uploadProcess);
            return arrObj;
        },
        singleUploadToS3 : async (_,args) =>{
            let t = await typeCheck(args.file);
            if (t){
                return uploadProcessToS3(args.file);
            }else{
                return {
                    success: false,
                    message: "Type Error"
                }
            }
            
        },
        multipleUploadToS3: async (_,args) => {
            let arrObj = (await Promise.all(args.files)).map(uploadProcessToS3);
            return arrObj;
        }
    }
}

module.exports = resolvers;