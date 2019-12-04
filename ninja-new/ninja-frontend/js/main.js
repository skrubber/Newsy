
var mainApp = angular.module("mainApp", ['ui.router', "ngSanitize", 'ngMessages', 'ngMaterial', 'ngAnimate', 'ngAria', 'landing_search', 'company', 'personal', 'industry', 'ninja', 'individual','intermediate']);
//Routing
mainApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'views/Individual/login.html',
            controller: 'inputController'
        })
        .state('landing', {
            url: '/landing',
            templateUrl: 'views/main/landing_search.html',
            controller: 'landing_search_controller',
        })
        .state('ninja', {
            url: '/ninja',
            templateUrl: 'views/main/ninja.html',
            controller: 'ninja_controller'
        })
        .state('main', {
            url: '/main?project?company?industry',
            templateUrl: 'views/Individual/main.html',
            controller: 'personal_controller',
            parent: 'ninja'
        })
        .state('personal', {
            url: '/personal?project?company?industry',
            templateUrl: 'views/Individual/personal.html',
            controller: 'individual_controller',
            parent: 'ninja'
        })
        .state('company', {
            url: '/company?project?company?industry',
            templateUrl: 'views/company/company.html',
            controller: 'company_controller',
            parent: 'ninja'
        })
        .state('intermediate', {
            url: '/intermediate?project?company?industry',
            templateUrl: 'views/company/intermediate.html',
            controller: 'intermediate_controller',
            parent: 'ninja'
        })
        .state('industry', {
            url: '/industry?project?company?industry',
            templateUrl: 'views/industry.html',
            controller: 'industry_controller',
            parent: 'ninja'
        });
        window.onpopstate = function (e) { window.history.forward(1); }
        window.onpopstate
});
mainApp.constant('server', {
    url: 'http://172.16.0.95:40004/news/'
});
if (navigator.appName == 'Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1))
{
  alert("This site is best viewed with Firefox, Chrome, Safari and Edge");
}
mainApp.controller('inputController', function ($scope, $state, $http,  $interval, $filter, $mdDialog, $element, $location, $rootScope, server) {
    $rootScope.loadingPercentage = 0;
    $rootScope.hidedetails = false;
    $rootScope.LoadingShow = false;
    $rootScope.selectedMenu = '';
    $scope.Companytoggle = true; // for toggling company
    $scope.Themes = false; // for toggling themes
    $scope.flag = 0; // for fetch details message
    $scope.personaldetails = []; //for storing personal details
    $rootScope.makePersonaldata = false; // for showing main and personal upon condition
    $scope.menuData = []; // for storing linkedin, bloomberg, peoplesearch and facebook
    $scope.selectedProfile = {}; // for storing selected profile
    $scope.project = []; // contains company, name and industry data   
    $scope.datamenu = []; // for storing tab data
    $scope.companylist = []; // for storing list of companies
    $scope.sidebarmenudata = [];
    $scope.sidebardata = [];
    $scope.Companytoggle = true;
    $scope.Themes = false;
    $scope.openform = false;
    // Social Media Images
    $scope.loginscreen = function () {
        
        $scope.Companytoggle = true;
        $scope.Themes = false;
    }
    $scope.signupscreen = function () {
        $scope.Companytoggle = false;
        $scope.Themes = true;
    }
    $scope.openpwdform = function(){
        $scope.openform = true;
        $scope.Themes = false;
        $scope.Companytoggle = false;
    }
    $scope.hidepwdform = function(){
        $scope.openform = false;
        $scope.Themes = false;
        $scope.Companytoggle = true;
    }
    $scope.loginform = function(user) {
        $rootScope.LoadingShow = true;
        $rootScope.hidedetails = true;
        $http.post('http://172.16.0.95:40004/auth/login/',
      {
        "email":$scope.user.email,
        "password":$scope.user.pwd      
        }).then(function (data) {
            localStorage.setItem("Auth_Token", data.data.key);
            localStorage.setItem("userName", data.data.name)
         if(localStorage.getItem("Auth_Token")){
            $state.go('landing'); 
         }
         else{
             $state.go('login');
         }
        }, function (reason) {
            $rootScope.LoadingShow = false;
            if(reason.data == 'password entered is wrong'){
                alert("Wrong Password. Enter valid password")
            }
            else if(reason.data == 'Username is wrong'){
                alert("Wrong Username. Enter valid username")
            }
            alert("Invalid! Enter valid credentials.")

        });     
    }
    $scope.reload = function () {
        $state.go('landing');  
    };
});