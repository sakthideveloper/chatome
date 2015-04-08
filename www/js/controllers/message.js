/**
 * Created by osei.fortune on 31/03/2015.
 */
angular.module('Chatome.Controllers')
    .controller('MessageCtrl', function (SharedProperties,$scope,Core,$ionicHistory,$state, $location, $ionicPlatform,$ionicScrollDelegate,$rootScope,$ionicPopup) {

        var scope = $scope;
      $scope.messages = SharedProperties.sharedData.messages;
        $scope.contactName = SharedProperties.sharedData.userClicked;
        $scope.userName = SharedProperties.sharedData.userName;
        $scope.userThumb = SharedProperties.sharedData.userThumb;
        $scope.currentUser = Parse.User.current()._serverData.username;
        $scope.currentUserThumb = Parse.User.current()._serverData.avatarThumb._url;

        $scope.userInCall = SharedProperties.sharedData.userTalkingTo;



        $scope.$on('$ionicView.beforeEnter', function() {
            Core.getMessages($scope.userName).then(function (data) {
                if($scope.messages.length == 0){
                    angular.forEach(data, function (value, key) {
                        this.push(value);
                    },  $scope.messages);

                    $ionicScrollDelegate.scrollBottom(true);
                }
                $ionicScrollDelegate.scrollBottom(true);

            }, function (error) {
                console.log(error)
            });

        });


        $scope.$on('$ionicView.beforeLeave', function() {
            SharedProperties.sharedData.messages = [];
        });






        $scope.scrollBottom = function() {
            $ionicScrollDelegate.scrollBottom(true);
        };


        $scope.sendMessage = function () {
            Core.sendMessage(scope.messageBody,$scope.userName);
            $ionicScrollDelegate.scrollBottom(true);

        };





       // $scope.$watch($scope.messages)

        $scope.messageUser = function (value) {

                if(value !== Parse.User.current()._serverData.username){
                    return $scope.userThumb;
                }else{
                    return Parse.User.current()._serverData.avatarThumb._url;
                }

        };

        $scope.callUser = function (user) {
        console.log(user);
            $state.go('voice',{id:user});
            Core.voiceCallUser(user);

        };


        $scope.videoCallUser = function (user) {
            $state.go('video',{id:user});
            Core.videoCallUser(user);
            $rootScope.inCall = true;

        };


        $scope.goBack = function () {
            $ionicHistory.goBack();
        };

        $scope.sendButton = false;
        $scope.$watch('messageBody', function (newVal, oldVal) {

            if(newVal != undefined){
                if(newVal.length > 0){
                    $scope.sendButton = true;
                }else if(newVal.length == 0){
                    $scope.sendButton = false;
                }

            }else{
            }
        });


        $scope.selectImage = function () {
            document.getElementById('footerImage').click();
        };

        $scope.sendImage = function (filetype,image) {
                    Core.sendImage(image,$scope.userName);
        }
    });