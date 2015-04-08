// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'Chatome.Controllers','Chatome.Factories','Chatome.Directives','naif.base64','Chatome.Filters'])

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {


        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];


        $urlRouterProvider.otherwise("/login");

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            })
            .state('signup', {
                url: "/signup",
                templateUrl: "templates/signup.html"
                ,controller: 'SignupCtrl'
            })
            .state('tabs', {
                url: "/tabs",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })
            .state('tabs.chats', {
                url: "/chats",
                views: {
                    'chats-tab': {
                        templateUrl: "templates/chats.html",
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('tabs.contacts', {
                url: "/contacts",
                views: {
                    'contacts-tab': {
                        templateUrl: "templates/contacts.html",
                        controller: 'ContactsCtrl'
                    }
                }
            })
            .state('tabs.settings', {
                url: "/settings",
                views: {
                    'settings-tab': {
                        templateUrl: "templates/settings.html",
                        controller: 'SettingsCtrl'
                    }
                }
            })
            .state('about', {
                url: "/about",
                templateUrl: "templates/about.html",
                controller: 'AboutCtrl'
            })
            .state('profile', {
                url: "/profile",
                templateUrl: "templates/profile.html",
                controller: 'ProfileCtrl'
            })
            .state('message', {
                url: "/message/:id",
                templateUrl: "templates/message.html",
                controller: 'MessageCtrl'
            })


    })

    .run(function ($ionicPlatform) {

        localforage.config({
            name: 'Chatome'
        });

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

        });
    });
