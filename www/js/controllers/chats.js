/**
 * Created by osei.fortune on 01/04/2015.
 */
angular.module('Chatome.Controllers')
    .controller('ChatsCtrl', function (SharedProperties,$scope) {

        $scope.userInCall = SharedProperties.sharedData.userTalkingTo;


    });