import { API, Storage } from 'aws-amplify';

AWSHandler = {
    handleImageUpload: (data, photoFromDisk, imageFileName) => {
        if("image_uri" in data['body'] && "latitude" in data['body'] && "longitude" in data['body']
            && "post_time" in data['body'] && "username" in data['body'] && "default_image" in data['body']){

        } else {
            console.log("error: incorrectly formatted AWS Storage put request")
        }

        fetch(photoFromDisk).then(response => {
            console.log('done fetching ' + imageFileName + ' from disk')
            response.blob().then(blob => {
            Storage.put(imageFileName, blob, { level: 'public', contentType: 'image/jpeg' }).then(() => {
                console.log('done putting image in storage');
                API.put("candidImageHandler", "/images", data).then(apiResponse => {
                    console.log(apiResponse);
                }).catch(e => {
                    console.log("error: uploading to candidImageHandler: " + e)
                    console.log(data);
                    console.log("trying again in 5 seconds");
                    setTimeout(function() {
                        API.put("candidImageHandler", "/images", data).then(apiResponse => {
                            console.log(apiResponse);
                        }).catch(e => {
                            console.log("error: likely due to a malformed lambda response issue");
                            console.log(e);
                        });
                    });
                });
            }).catch(e => {console.log("error: uploading to storage: " + e)})
          })
        }).catch(e => {console.log("error: fetching from phone disk: " + e)})
    }
}

export default AWSHandler;