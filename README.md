# IBM Cloud Object Storage



```ibmcloud-objectstorage``` is a npm to manage your files with **Node.js**

# First Step
Use this link to create your container on IBM Cloud and retrieve your credentials
[IBM Cloud Object Storage](https://console.bluemix.net/developer/appservice/create-project?services=Object-Storage)

# Usage

In your project root directory:
```sh
$ npm install ibmcloud-objectstorage -s
```

In your .js file, using the credentials you retrieved from the IBM Cloud console, fill the attributes inside ```config```
```javascript
var ObjectStorage = require('./cloudstorage');
var config = {
    provider: '',
    useServiceCatalog: true,
    useInternal: false,
    keystoneAuthVersion: '',
    authUrl: '',
    tenantId: '', //projectId from credentials
    domainId: '',
    username: '',
    password: '',
    region: '' //dallas or london region
};
var os = new ObjectStorage(config, "my-container");
```

ibmcloud-objectstorage uses the following functions, which are all promises:

```find``` - Retrieves all the files inside the container you specified.
```javascript
    os.find().then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    })
```

```findByName``` - Retrieves the file you specified, from the container.
```javascript
    os.findByName('file.txt').then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    })
```

```removeByName``` - Deletes the file you specified, from the container.
```javascript
    os.removeByName('file.txt').then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    })
```

```insert``` - Inserts the file you specified, on the container.
```javascript
    os.insert('file.txt').then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    })
```

### Licence
MIT

### Author
Edison Cury Neto
