const fs = require('fs');
const {v4: uuid} = require('uuid');

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

const resolvers = {
    Mutation: {
        singleUpload : async (_, args)=>{
           return uploadProcess(args.file);
        },
        multipleUpload : async (_, args)=>{
            let obj = (await Promise.all(args.files)).map(uploadProcess);
            return obj;
        }
    }
}

module.exports = resolvers;