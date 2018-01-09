var pkgcloud = require('pkgcloud');
var fs = require('fs');

class ObjectStorage{
    constructor(config, containerName){
        this.config = config;
        this.containerName = containerName;
    }

    init(){
        return new Promise((resolve, reject) => {
            var config = this.config;
            var containerName = this.containerName;
            var storageClient = pkgcloud.storage.createClient(config);
            storageClient.auth(function (err) {
                if (err) {
                    reject(err);
                } else {
                    storageClient.getContainer(containerName, (err, container) => {
                        if (err) reject(err);
                        resolve({
                            container: container,
                            client: storageClient
                        });
                    })
                }
            })
        });
    };
    
    create(containerToBeCreated){
        return new Promise((resolve, reject) => {
            var storageClient = pkgcloud.storage.createClient(this.config);
            storageClient.createContainer(containerToBeCreated, (err, response) => {
                console.log(err);
                if(err){
                    reject(err);
                }else{
                    this.containerName = containerToBeCreated;
                    resolve(response);
                }
            })
        })
    }

    find(){
        return new Promise((resolve, reject) => {
            this.init().then((storage) => {
                var client = storage.client;
                var container = storage.container;
                client.getFiles(container, (err, files) => {
                    if (err) reject(err);
                    var names = [];
                    for (var idx in files) {
                        names.push(files[idx]['name']);
                    }
                    console.log(names);
                    resolve(names);
                })
            })
        })
    };
    
    findByName(name){
        return new Promise((resolve, reject) => {
            this.init().then((storage) => {
                var client = storage.client;
                var container = storage.container;
                client.getFile(container, name, (err, file) => {
                    if (err) reject({
                        err: true,
                        status: 404
                    });
                    var upload = client.download({
                        container: container.name,
                        remote: name
                    }).pipe(fs.createWriteStream('./uploads/' + name));
                    upload.on('finish', () => {
                            resolve(upload);
                            console.log('Download finished');
                        })
                        .on('error', () => {
                            reject({
                                err: true
                            })
                        })
                })
            })
        })
    };
    
    removeByName(name){
        return new Promise((resolve, reject) => {
            this.init().then((storage) => {
                    var client = storage.client;
                    var container = storage.container;
                    client.removeFile(container, name, (err) => {
                        if (err) reject(err);
                        resolve({
                            removed: true
                        });
                    })
                })
                .catch((err) => {
                    reject(err);
                })
        })
    };
    
    insert(file){
        return new Promise((resolve, reject) => {
            console.log("Insert File received: " + file)
            this.init().then((storage) => {
                var client = storage.client;
                var container = storage.container;
    
                var myFile = fs.createReadStream(file.path);
                var upload = client.upload({
                    container: container.name,
                    remote: file.fieldname
                });
                
                upload.on('error', function (err) {
                    console.error(err);
                    reject(err);
                });
                upload.on('success', function (file) {
                    resolve(file.toJSON());
                });
                myFile.pipe(upload);
            })
        })
    };
}

module.exports = ObjectStorage;