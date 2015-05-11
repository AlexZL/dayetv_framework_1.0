/**
 * Created by Administrator on 2015/4/9.
 */
var original_class=[];
var root_ratios=[];
var dayetvApp=angular.module("dayetvApp",[
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'indexPageController',
    "registerPageController",
    "userPageController",
    "mailPageController",
    'registerPageService',
    'mailPageService',
    'dayetvAppDirective'
]);


dayetvApp.config(['$routeProvider',function($routeProvider){
    $routeProvider.
        when('/main',{
            templateUrl:'web_pages/main.html',
            controller:''
        }).
        when('/login',{
            templateUrl:'web_pages/login_page.html',
            controller:'headDivController'
        }).
        when('/nav_4_0',{
            templateUrl:'web_pages/drawing/drawing_index.html',
            controller:''
        }).
        when('/nav_4_4',{
            templateUrl:'web_pages/drawing/drawing_upload.html',
            controller:''
        }).
        when('/user',{
            templateUrl:'web_pages/user_main.html',
            controller:'userPageController'
        }).
        when("/register",{
            templateUrl:'web_pages/register_page.html',
            controller:'registerController'
        }).
        when("/nav_0_1",{
            templateUrl:'web_pages/mail.html',
            controller:'mailPageController'
        }).
        otherwise({
            redirectTo:'/main'
        });
}]);


