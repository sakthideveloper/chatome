/**
 * Created by osei.fortune on 27/03/2015.
 */
angular.module('Chatome.Controllers')
    .controller('LoginCtrl', function ($scope, $state,Core) {


        $scope.goToSignup = function () {
            $state.go('signup')
        }


        Core.checkIfLogged();

        $scope.login = function (username,password) {

            Core.userLogin(username,password);
        }


    });