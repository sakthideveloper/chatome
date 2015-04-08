/**
 * Created by osei on 3/30/15.
 */
angular.module('Chatome.Controllers')
    .controller('ProfileCtrl', function ($scope, Core, $ionicPopup, $ionicLoading,$state,SharedProperties,$rootScope) {


        //Check what $state users coming from

        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                console.log(toState);
                console.log(toParams);
                console.log(fromParams);
                console.log(fromParams)

            });

        $scope.userInCall = SharedProperties.sharedData.userTalkingTo;

        function checkIfLogged() {

            var currentUser = Parse.User.current();

            if(currentUser == null){
                $state.go('login')
            }

        }


        checkIfLogged();

        Core.getUserProfile().then(
            function (success) {
                $scope.user = success;
                $scope.dn = success._serverData.displayName;
                if(success._serverData.avatar == null){
                    $scope.userAvatar = 'img/no-avatar.png';
                }else{
                    $scope.userAvatar = success._serverData.avatar._url;
                }

            }, function (error) {
                console.log(error)
            }
        );

        $scope.updateDn = function (dn) {
            Core.updateDisplayName(dn)
        };

        $scope.updateAvatar = function (avatar) {


            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });


            Core.updateAvatar(avatar).then(function (img) {
                $ionicLoading.hide();
                $scope.userAvatar = img._serverData.avatar._url;
            }, function (err) {

                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'Oops :(',
                    template: err.message
                }).then(function (res) {
                });


            })
        }


        $scope.propic = function () {
            document.getElementById('userProPic').click();
        }

        
        $scope.callUser = function () {
            
        }
    });