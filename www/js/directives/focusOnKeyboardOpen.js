/**
 * Created by osei.fortune on 01/04/2015.
 */
angular.module('Chatome.Directives')
    .directive('focusOnKeyboardOpen', function($window){
        'use strict';
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                var keyboardOpen = false;
                $window.addEventListener('native.keyboardshow', function(e){
                    keyboardOpen = true;
                    element[0].focus();
                });
                $window.addEventListener('native.keyboardhide', function(e){
                    keyboardOpen = false;
                    element[0].blur();
                });

                element[0].addEventListener('blur', function(e){
                    if(keyboardOpen){
                        element[0].focus();
                    }
                }, true);
            }
        };
    })