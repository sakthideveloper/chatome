/**
 * Created by osei.fortune on 27/03/2015.
 */
angular.module('Chatome.Factories')
    .factory('Core', function ($state, $ionicPopup, $q, $rootScope, $ionicLoading, $timeout, $location, SharedProperties, $ionicScrollDelegate) {


        var Core = {};


       var sinchClient = new SinchClient({
           applicationKey: 'applicationKey',
           capabilities: {messaging: true},
           supportActiveConnection: true

       });

        SharedProperties.sharedData.messages = [];
        var messages = SharedProperties.sharedData.messages;


        var appSecret = "appSecret";

        Parse.initialize("ApplicationID", "JavaScriptkey");


        /*Chatome user functions*/

        Core.userRegister = function (username, email, password) {

            var self = this;
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });


            var user = new Parse.User();
            user.set("username", username);
            user.set("password", password);
            user.set("email", email);


            user.signUp(null, {
                success: function (user) {


                    var userTicket = {
                        'identity': {'type': 'username', 'endpoint': user._serverData.username},
                        'applicationKey': sinchClient.applicationKey,
                        'created': new Date().toISOString()
                    };


                    var userTicketJson = JSON.stringify(userTicket).replace(" ", "");
                    var userTicketBase64 = btoa(userTicketJson);

                    var digest = CryptoJS.HmacSHA256(userTicketJson, CryptoJS.enc.Base64.parse(appSecret));

                    var signature = CryptoJS.enc.Base64.stringify(digest);

                    var signedUserTicket = userTicketBase64 + ':' + signature;


                    sinchClient.start({'userTicket': signedUserTicket})
                        .then(function () {
                            self.startSinchCore();
                            localforage.setItem('userProfile', user).then(function () {

                                $ionicLoading.hide();
                                $state.go('profile');
                            })
                        })
                        .fail(function (error) {
                            console.log(error)
                        });


                },
                error: function (user, error) {

                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Oops :(',
                        template: error.message
                    }).then(function (res) {
                    });

                }
            });


        };

        Core.userLogin = function (username, password) {

            var self = this;
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });


            Parse.User.logIn(username, password, {
                success: function (user) {


                    var userTicket = {
                        'identity': {'type': 'username', 'endpoint': user._serverData.username},
                        'applicationKey': sinchClient.applicationKey,
                        'created': new Date().toISOString()
                    };


                    var userTicketJson = JSON.stringify(userTicket).replace(" ", "");
                    var userTicketBase64 = btoa(userTicketJson);

                    var digest = CryptoJS.HmacSHA256(userTicketJson, CryptoJS.enc.Base64.parse(appSecret));

                    var signature = CryptoJS.enc.Base64.stringify(digest);

                    var signedUserTicket = userTicketBase64 + ':' + signature;


                    sinchClient.start({'userTicket': signedUserTicket})
                        .then(function () {

                            localforage.setItem('sessionObj', sinchClient.getSession()).then(function () {

                                localforage.setItem('userProfile', user).then(function () {
                                    self.startSinchCore();
                                    $ionicLoading.hide();
                                    $state.go('tabs.chats');
                                })

                            })


                        })
                        .fail(function (error) {
                            console.log(error);
                            $ionicLoading.hide();
                        });


                },
                error: function (user, error) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Oops :(',
                        template: error.message
                    }).then(function (res) {
                    });


                }
            });


        };


        Core.getUserProfile = function () {
            var deferred = $q.defer();
            var currentUser = Parse.User.current();

            if (!currentUser) {
                deferred.reject('Not logged in')
            } else {
                deferred.resolve(currentUser)
            }

            return deferred.promise

        };


        Core.updateDisplayName = function (dn) {


            var user = Parse.User.current();
            user.set("displayName", dn);


            user.save(null, {
                success: function (user) {
                    console.log(user)
                },
                error: function (user, error) {

                    alert("Error: " + error.code + " " + error.message);
                }
            });


        };

        Core.updateAvatar = function (avatar) {


            var deferred = $q.defer();

            var userAvatar = new Parse.File("avatar", {base64: avatar.base64});


            userAvatar.save().then(function (data) {


                var user = Parse.User.current();
                user.set("avatar", data);


                user.save(null, {
                    success: function (user) {
                        console.log(user);
                        deferred.resolve(user);

                    },
                    error: function (user, error) {

                        deferred.reject(error.message);
                    }
                });


            }, function (error) {
                $ionicPopup.alert({
                    title: 'Oops :(',
                    template: error.message
                }).then(function (res) {
                });

            });


            return deferred.promise;

        };


        Core.checkIfLogged = function () {
            var self = this;
            var currentUser = Parse.User.current();

            if (currentUser === null) {

                if ($location.path() === '/login') {

                    $ionicLoading.hide();

                } else {
                    $ionicLoading.hide();
                    $state.go('login');
                }
            } else {


                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });

                localforage.getItem('sessionObj').then(function (succ) {

                    if (succ != null) {
                        sinchClient.start(succ)
                            .then(function () {
                                self.startSinchCore();
                                $ionicLoading.hide();
                                $state.go('tabs.chats');

                            })
                            .fail(function () {
                                $state.go('login')
                            });

                    } else {
                        $state.go('login')
                    }

                })


            }

        };


        Core.logOut = function () {


            $ionicPopup.confirm({
                title: 'Log Out',
                template: "<p class='text-center'>Are you sure? <br> <img src='../../lib/emojione/assets/png/1F62D.png'></p>"
            }).then(function (res) {
                if (res) {
                    console.log('You are sure');
                    window.localStorage.clear();
                    localforage.clear(function (err) {
                    });
                    sinchClient.stopActiveConnection();
                    $rootScope.username = '';
                    $rootScope.password = '';
                    $state.go('login')
                } else {
                    console.log('You are not sure');
                }
            });

        };

        /*Chatome messaging functions*/

        Core.messageClient = sinchClient.getMessageClient();


        Core.sendMessage = function (messageBody, messageTo) {

            var message = Core.messageClient.newMessage(messageTo, messageBody);
            Core.messageClient.send(message, function () {

                var messageObj = {
                    direction: message.direction,
                    sinchId: message.messageId,
                    recipientId: message.recipientIds[0],
                    senderId: message.senderId,
                    messageText: message.textBody
                }
                messages.push(messageObj);
                $rootScope.$apply();
                $ionicScrollDelegate.scrollBottom(true);


                var Message = Parse.Object.extend("Messages");
                var query = new Parse.Query(Message);
                query.equalTo("sinchId", message.messageId);
                query.find().then(function (data) {

                    if (data.length == 0) {
                        var currentUser = Parse.User.current().getUsername();
                        var ParseMessage = Parse.Object.extend("Messages");
                        var parseMessage = new ParseMessage();

                        parseMessage.set("senderId", message.senderId);
                        parseMessage.set("recipientId", message.recipientIds[0]);
                        parseMessage.set("messageText", message.textBody);
                        parseMessage.set("sinchId", message.messageId);
                        parseMessage.set("direction", message.direction);
                        parseMessage.set("timeStamp", message.timeStamp);

                        parseMessage.save().then(function (message) {

                            console.log('Saved sent message')
                            /*
                             var currentUser = Parse.User.current().getUsername();
                             var Message = Parse.Object.extend("Messages");
                             var query = new Parse.Query(Message);
                             query.containedIn("senderId", [currentUser, messageTo]);
                             query.containedIn("recipientId", [currentUser, messageTo]);
                             query.ascending("createdAt");
                             query.find().then(function (data) {
                             //  messages.push(data[data.length - 1]._serverData);
                             console.log(messages)
                             }, function (err) {
                             console.log(err)
                             })

                             */

                        }, function (error) {
                            console.log(error)
                        })

                    }

                }, function (error) {
                    console.log(error)
                })

            }, function (error) {
                console.log(error)
            });


            var senderObj = {

                onMessageDelivered: function (messageDeliveryInfo) {
                    console.log(messageDeliveryInfo)
                }

            };

            Core.messageClient.addEventListener(senderObj);


        };


        Core.messageRec = function () {

            var myListenerObj = {
                onIncomingMessage: function (message) {
                    // var currentUser = Parse.User.current().getUsername();

                    var chattingWith = SharedProperties.sharedData.userName;


                    if (messages.length == 0) {

                        console.log('Y u no chat')
                    } else {

                        if (messages[messages.length - 1].sinchId == message.messageId) {
                            console.log('Already added ');
                        } else {

                            if (message.senderId != chattingWith) {
                                console.log('Not chatting with ' + message.senderId)
                            } else {
                                console.log('Adding Incoming message');

                                var messageObj = {
                                    direction: message.direction,
                                    sinchId: message.messageId,
                                    recipientId: message.recipientIds[1],
                                    senderId: message.senderId,
                                    messageText: message.textBody
                                }
                                messages.push(messageObj);
                                $rootScope.$apply();
                                $ionicScrollDelegate.scrollBottom(true);
                            }
                        }

                    }


                    /*
                     var Message = Parse.Object.extend("Messages");
                     var query = new Parse.Query(Message);
                     query.containedIn("senderId", [message.recipientIds[0], message.recipientIds[1]]);
                     query.containedIn("recipientId", [message.recipientIds[0], message.recipientIds[1]]);
                     query.ascending("createdAt");
                     query.find({
                     success: function (data) {

                     console.log(data)

                     var chattingWith = SharedProperties.sharedData.userName;
                     console.log(data[data.length - 1]._serverData.sinchId)
                     console.log(messages[messages.length - 1].sinchId );
                     if(messages[messages.length - 1].sinchId ==  data[data.length - 1]._serverData.sinchId){
                     console.log('Already added ');
                     }else{

                     if (data[data.length - 1]._serverData.senderId != chattingWith) {
                     console.log('Not chatting with '+data[data.length - 1]._serverData.senderId)
                     }else{
                     console.log('Adding Incoming message');
                     messages.push(data[data.length - 1]._serverData);
                     console.log(messages)
                     }
                     }




                     },
                     error: function (error) {
                     console.log(error.message);
                     }
                     });

                     */

                }


            };

            Core.messageClient.addEventListener(myListenerObj);

        }

        Core.loadOldMessages = function () {

            var userName = SharedProperties.sharedData.userName;
            var deferred = $q.defer();

            var currentUser = Parse.User.current().getUsername();
            var Message = Parse.Object.extend("Messages");
            var query = new Parse.Query(Message);
            query.containedIn("senderId", [currentUser, userName]);
            query.containedIn("recipientId", [currentUser, userName]);
            query.ascending("createdAt");
            query.limit(20);
            query.find({
                success: function (data) {
                    angular.forEach(data, function (value, key) {
                        this.push(value._serverData);
                    }, messages);
                    deferred.resolve(messages);

                },
                error: function (error) {
                    console.log(error.message);
                    deferred.reject(error.message)
                }
            });


            return deferred.promise;
        }

        Core.getMessages = function (recipient) {

            var deferred = $q.defer();
            var currentUser = Parse.User.current().getUsername();
            var Message = Parse.Object.extend("Messages");
            var query = new Parse.Query(Message);
            query.containedIn("senderId", [currentUser, recipient]);
            query.containedIn("recipientId", [currentUser, recipient]);
            query.ascending("createdAt");
            query.find().then(function (data) {
                angular.forEach(data, function (value, key) {
                    this.push(value._serverData);
                }, messages);
                deferred.resolve(messages);

            }, function (error) {
                console.log(error.message);
                deferred.reject(error.message)

            });

            return deferred.promise;
        };


        Core.sendImage = function (image, imageTo) {

            var message = Core.messageClient.newMessage(imageTo, ':image:');

            var messageObj = {
                direction: message.direction,
                sinchId: message.messageId,
                recipientId: message.recipientIds[0],
                senderId: message.senderId,
                messageText: message.textBody
            };


            var messageImage = new Parse.File("messageImg", {base64: image});


            messageImage.save().then(function (data) {

                var Message = Parse.Object.extend("Messages");
                var query = new Parse.Query(Message);
                query.equalTo("sinchId", message.messageId);
                query.find().then(function (msg) {

                    if (msg.length == 0) {
                        var currentUser = Parse.User.current().getUsername();
                        var ParseMessage = Parse.Object.extend("Messages");
                        var parseMessage = new ParseMessage();

                        parseMessage.set("senderId", message.senderId);
                        parseMessage.set("recipientId", message.recipientIds[0]);
                        parseMessage.set("messageText", message.textBody);
                        parseMessage.set("sinchId", message.messageId);
                        parseMessage.set("direction", message.direction);
                        parseMessage.set("image", data);
                        //parseMessage.set("timeStamp", message.timeStamp);

                        parseMessage.save().then(function (message) {

                            console.log('Saved message to send');

                            Core.messageClient.send(message, function () {

                                var Message = Parse.Object.extend("Messages");
                                var query = new Parse.Query(Message);
                                query.containedIn("senderId", [currentUser, message.recipientIds[0]]);
                                query.containedIn("recipientId", [currentUser, message.recipientIds[0]]);
                                query.ascending("createdAt");
                                query.find().then(function (data) {
                                    angular.forEach(data, function (value, key) {
                                        this.push(value._serverData);
                                    }, messages);

                                    console.log(messages)

                                }, function (error) {
                                    console.log(error.message);

                                });


                             //   messages.push(messageObj);
                                $rootScope.$apply();
                                $ionicScrollDelegate.scrollBottom(true);

                            }, function (error) {
                                console.log(error)
                            });

                            /*
                             var currentUser = Parse.User.current().getUsername();
                             var Message = Parse.Object.extend("Messages");
                             var query = new Parse.Query(Message);
                             query.containedIn("senderId", [currentUser, messageTo]);
                             query.containedIn("recipientId", [currentUser, messageTo]);
                             query.ascending("createdAt");
                             query.find().then(function (data) {
                             //  messages.push(data[data.length - 1]._serverData);
                             console.log(messages)
                             }, function (err) {
                             console.log(err)
                             })

                             */

                        }, function (error) {
                            console.log(error)
                        })

                    }

                }, function (error) {
                    console.log(error)
                })

            }, function (error) {

            });




            var imageSenderObj = {

                onMessageDelivered: function (messageDeliveryInfo) {
                    console.log(messageDeliveryInfo)
                }

            };

            Core.messageClient.addEventListener(imageSenderObj);


        }

        /*Chatome core functions*/

        Core.startSinchCore = function () {
            sinchClient.startActiveConnection();
            Core.callClient.initStream().then(function () {
            });
            Core.messageRec();
            Core.videoCallRec();
            //    this.voiceCallRec();

        };

        /*Chatome contact functions*/


        Core.addContact = function () {


            var currentUser = Parse.User.current().getUsername();

            $rootScope.data = {};

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="data.user">',
                title: 'Add Contact',
                subTitle: 'Enter the username to add',
                scope: $rootScope,
                buttons: [
                    {text: 'Cancel'},
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$rootScope.data.user) {
                                e.preventDefault();
                            } else if (e.keyCode == 32) {
                                e.preventDefault();
                                $ionicPopup.alert({
                                    title: 'Oops :(',
                                    template: 'No spaces plz <3'
                                }).then(function (res) {
                                });
                            }
                            else {
                                return $rootScope.data.user;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {


                var Contact = Parse.Object.extend("Contacts");
                var query = new Parse.Query(Contact);


                query.equalTo("createdBy", currentUser);
                query.equalTo("contactUsername", res);
                query.find({
                    success: function (user) {

                        console.log(Parse.User.current().getUsername());

                        if (user.length == 0) {


                            if (res == null) {

                                console.log('Cannot be empty ')
                            } else if (res == Parse.User.current().getUsername()) {
                                console.log("Cannot add yourself ._.'");
                            }
                            else {


                                var currentUser = Parse.User.current().getUsername();
                                var Contact = Parse.Object.extend("Contacts");
                                var contact = new Contact();

                                contact.set("contactUsername", res);
                                contact.set("createdBy", currentUser);


                                contact.save(null, {
                                    success: function (contact) {
                                        console.log(contact)
                                    },
                                    error: function (contact, error) {
                                        console.log(error.message)
                                    }
                                });


                            }


                        } else {


                            var dupContact = angular.element(user)[0]._serverData.contactUsername;

                            if (res == null) {

                                console.log('Cannot be empty ')
                            } else if (res == dupContact) {

                                console.log('Contact already added')
                            }


                        }


                    }, error: function (user, error) {
                        console.log(error.message)
                    }
                });


                myPopup.close();
            });


        };

        Core.getContacts = function () {


            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });


            var deferred = $q.defer();
            var currentUser = Parse.User.current().getUsername();
            var Contacts = Parse.Object.extend("Contacts");
            var query = new Parse.Query(Contacts);
            query.equalTo("createdBy", currentUser);
            query.find({
                success: function (contacts) {

                    var contactList = [];


                    if (contacts.length == 0) {
                        $ionicLoading.hide();
                        deferred.resolve('addSome');

                    } else {
                        for (var i in contacts) {
                            var query = new Parse.Query(Parse.User);
                            query.equalTo("username", contacts[i]._serverData.contactUsername);
                            query.ascending("displayName");
                            query.find({
                                success: function (users) {
                                    angular.forEach(users, function (value, key) {
                                        this.push(value._serverData);
                                    }, contactList);

                                    deferred.resolve(contactList);
                                    $ionicLoading.hide();
                                },
                                error: function (error) {
                                    console.log(error)
                                }
                            });


                        }
                    }


                },
                error: function (error) {
                    deferred.reject(error.message)
                }
            });


            return deferred.promise;
        };


        return Core;


    });