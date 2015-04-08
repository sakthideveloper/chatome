#Chatome : Lite version to my upcoming messaging app :)

Chatome: Hybrid messaging app created with Ionic + Parse + Sinch

Currently only works with android because of crosswalk :)

##Requirements


[Sinch account api](https://www.sinch.com/)

[Parse account api] (https://parse.com/)

[Ionic] (http://ionicframework.com/getting-started/)

##Setup
```
git clone https://github.com/fitcom/chatome.git
cd chatome
ionic browser add crosswalk
```


Add the [code](https://github.com/fitcom/chatome/blob/master/parseCLoudCode.js) located to your parse cloud

follow [this](https://parse.com/docs/cloud_code_guide#started) method and add the code to your main.js



Edit the core factories file located in www/js/factories/core.js

Change to your sinch application key to 

``` javascript
 var sinchClient = new SinchClient({
            applicationKey: 'applicationKey',
            capabilities: {messaging: true},
            supportActiveConnection: true

        });
```
Change to your sinch application secret to

``` javascript
var appSecret = "appSecret";
``` 

Change to your Parse AppId and JavaScriptkey

``` javascript
 Parse.initialize("ApplicationID", "JavaScriptkey");
 ``` 
##Running

### Emulator
I recommend installing [Genymotion](https://www.genymotion.com/) for testing

to run open your terminal or command prompt
```
cd chatome
ionic run android
```
If you choose to run using the default android emulator then then run the project using
```
cd chatome
ionic emulate android
```
### Running in browser 
```
cd chatome
ionic serve
```
If you would like to see what the app would look like on the device (Android or IOS)
```
cd chatome
ionic serve --lab
```

## Todo's
+ Finish messages code
+ Add password reset
