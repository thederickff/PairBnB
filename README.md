# PairBnB

A place booking app, where people can offer their places and you can book other places, a little bit like AirBnB

## Important

Paste this code below as a new file <code>src/environments/environment.ts</code>

```typescript
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // I am using firebase's realtime database url, you can use any other
  serverBaseUrl: "<PLACE YOUR BACKEND URL HERE>",
  googleMapsApiKey: "<PLACE YOUR GOOGLE MAPS API KEY HERE>",
  firebaseApiKey: "<PLACE YOUR FIREBASE API KEY HERE>"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
```

### Install globally firebase-tools with

<code>npm install -g firebase-tools</code>
Login
<code>firebase login</code>
And init
<code>firebase init</code>
Select the <code>functions</code> option and select a project
The folder <code>functions</code> will be created.
Then paste this code into <code>functions/index.js</code> (this is of course, the Firebase Cloud Functions which will be by the app).

```javascript
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const Busboy = require("busboy");
const os = require("os");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid/v4");

const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "YOUR_FIREBASE_PROJECT_ID"
});

exports.storeImage = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(500).json({ message: "Not allowed." });
    }
    const busboy = new Busboy({ headers: req.headers });
    let uploadData;
    let oldImagePath;

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const filePath = path.join(os.tmpdir(), filename);
      uploadData = { filePath: filePath, type: mimetype, name: filename };
      file.pipe(fs.createWriteStream(filePath));
    });

    busboy.on("field", (fieldname, value) => {
      oldImagePath = decodeURIComponent(value);
    });

    busboy.on("finish", () => {
      const id = uuid();
      let imagePath = "images/" + id + "-" + uploadData.name;
      if (oldImagePath) {
        imagePath = oldImagePath;
      }

      console.log(uploadData.type);
      return storage
        .bucket("YOUR_FIREBASE_PROJECT_ID.appspot.com")
        .upload(uploadData.filePath, {
          uploadType: "media",
          destination: imagePath,
          metadata: {
            metadata: {
              contentType: uploadData.type,
              firebaseStorageDownloadTokens: id
            }
          }
        })

        .then(() => {
          return res.status(201).json({
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/" +
              storage.bucket("YOUR_FIREBASE_PROJECT_ID.appspot.com").name +
              "/o/" +
              encodeURIComponent(imagePath) +
              "?alt=media&token=" +
              id,
            imagePath: imagePath
          });
        })
        .catch(error => {
          console.log(error);
          return res.status(401).json({ error: "Unauthorized!" });
        });
    });
    return busboy.end(req.rawBody);
  });
});
```

Add these four dependencies into <code>functions/package.json</code>

```json
{
  ...
  "dependencies": {
    ...
    "@google-cloud/storage": "^2.3.4",
    "busboy": "^0.2.14",
    "cors": "^2.8.4",
    "uuid": "^3.2.1"
  },
  ...
}

```

Then finally use <code>npm install</code> inside the <code>functions/</code> folder and use
<code>firebase deploy</code> inside the project root folder.

After that
define the <code>uploadImageCloudFunctionUrl</code> property on <code>src/environments/environment.ts</code>:

```javascript
const environment = {
  ...,
  uploadImageCloudFunctionUrl: '<PLACE YOUR CLOUD FUNCTION URL HERE>'
}
```
