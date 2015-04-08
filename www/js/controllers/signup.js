/**
 * Created by osei.fortune on 27/03/2015.
 */
angular.module('Chatome.Controllers')
.controller('SignupCtrl', function ($scope,Core,$state) {


        $scope.goToLogin = function () {
            $state.go('login');
        }


        $scope.signup = function (username,email,password) {
            Core.userRegister(username,email,password);
        }

    });