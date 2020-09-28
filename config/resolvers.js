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
            reject(error);
        })
        .pipe(fs.createWriteStream(path))
        .on("finish", ()=> {
            resolve({
                filename, mimetype, encoding, location: path
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

const resolvers = {
    Mutation: {
        singleUpload : async (_, args)=>{
           return uploadProcess(args.file);
        },
        multipleUpload : async (_, args)=>{
            let obj = (await Promise.all(args.files)).map(uploadProcess);
            return obj;
        },
        singleUploadToS3 : async (_,args) =>{
            return uploadProcessToS3(args.file);
        },
        multipleUploadToS3: async (_,args) => {
            let arrObj = (await Promise.all(args.files)).map(uploadProcessToS3);
            return arrObj;
        }
    }
}

module.exports = resolvers;