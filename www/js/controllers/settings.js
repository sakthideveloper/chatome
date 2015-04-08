/**
 * Created by osei.fortune on 27/03/2015.
 */
angular.module('Chatome.Controllers')
    .controller('SettingsCtrl', function ($scope,Core,SharedProperties) {

        $scope.list = [
            {name:'About',link:'#about'},
            {name:'Invite',link:'#'},
            {name:'Profile',link:'#profile'}
        ]

        $scope.logout = function () {
Core.logOut()
        }

        $scope.userInCall = SharedProperties.sharedData.userTalkingTo;

    });