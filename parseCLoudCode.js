
var Image = require("parse-image");
Parse.Cloud.beforeSave(Parse.User, function(request, response) {
Parse.Cloud.httpRequest({
    url: request.object.get("avatar").url()
}).then(function(response) {
    var image = new Image();
    return image.setData(response.buffer);
}).then(function(image) {
    // make it fit in 100x100
    var width = 100, height = 100;
    if (image.width() > image.height()) {
        // work out scaled height
        height = image.height() * (100/image.width());
    } else {
        // work out scaled width
        width = image.width() * (100/image.height());
    }
    console.log("..scale to " + width + "x" + height);
    return image.scale({
        width: width,
        height: height
    });
}).then(function(scaledImage) {
    // get the image data in a Buffer
    return scaledImage.data();
}).then(function(buffer) {
    // save the image to a new file
    console.log("..saving file");
    var base64 = buffer.toString("base64");
    var name = "Thumbnail.png";
    var thumbnail = new Parse.File(name, { base64: base64 });
    return thumbnail.save();
}).then(function(thumbnail) {
    // attach the image file to the original object
    console.log("..attaching file");
    request.object.set("avatarThumb", thumbnail);
response.success();
    return request.object.save();
  
});
 
});
