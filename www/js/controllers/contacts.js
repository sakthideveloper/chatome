/**
 * Created by osei.fortune on 27/03/2015.
 */
angular.module('Chatome.Controllers')
    .controller('ContactsCtrl', function (Core,$scope,$ionicPopup,SharedProperties) {

        $scope.userInCall = SharedProperties.sharedData.userTalkingTo;

        $scope.addContact = function () {
            Core.addContact()

        };

       function getContacts() {
           Core.getContacts().then(function (contacts) {
               $scope.items = contacts;

           }, function (error) {
               console.log(error)
           })
       }

        getContacts();


        $scope.contactClicked = function (username,contactname,avatar,thumb) {
            SharedProperties.sharedData.userClicked = contactname;
            SharedProperties.sharedData.userName = username;
            SharedProperties.sharedData.userPropic = avatar;
            SharedProperties.sharedData.userThumb = thumb;
        }


    });