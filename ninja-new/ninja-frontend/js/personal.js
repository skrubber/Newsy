angular.module('personal', ['ngMaterial']).controller('personal_controller', personal_controller);
function personal_controller($http, $stateParams, $rootScope, $scope, $state, server, $interval) {
    $rootScope.selectedMenu = 'main';
    $rootScope.personal = false;
    $rootScope.hidesource = false;
    $rootScope.profileData = [];
    $scope.rootPersonalDetails = null;
    $scope.selectedprofiledata = {};
    $rootScope.sources = [];
    $rootScope.modulename = 'Individual Module';
    $rootScope.messageforindividual = 'Select social media profiles for the searched individual';
    $scope.menuData = null;
    if ($stateParams.project) {
        $rootScope.hidesource = false;
        $rootScope.loadingPercentage = 0;
        // StartTimer();
        $rootScope.profileData = '';
        $rootScope.LoadingShow = true;
        var personaldata = {
            "name": $stateParams.project,
            "_id": JSON.parse($stateParams.company)._id,
            'data_for': 2
        }
        $http.post(server.url + 'search', personaldata,
            {
                headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") }
            }).then(function (data) {
                var progress = 1;
                $scope.menuData = [];
                $rootScope.flag = 0;
                $rootScope.loadingPercentage = 100;
                $scope.rootPersonalDetails = data.data.Personal;
                angular.forEach($scope.rootPersonalDetails, function (item, key) {
                    $scope.selectedprofiledata[key] = null;
                    if (key != 'Company' && $scope.menuData.indexOf(key) === -1) $scope.menuData.push(key);
                });
                $scope.menuSelectedValue = $scope.menuData[0];
                $rootScope.LoadingShow = false;
            }, function (reason) { 
                $scope.rootPersonalDetails = [];
                 $rootScope.LoadingShow = false; 
                  if (reason.status == 401) {
                    alert('Logout and login, as some user has logged in with the same credentials')
                    $state.go('/');
                }
                else{
                    alert('Session time out.')
                } 
             });
           //  StopTimer();
    }
    else {
        $scope.rootPersonalDetails = [];
    }
    $scope.images = {
        'Facebook': 'images/icons/icons/F_icon.svg',
        'LinkedIn': 'images/icons/icons/linkedin_icon.png',
        'Bloomberg': 'images/icons/icons/black-180x180.png'
    }
    $scope.menuChange = function (index) {
        $scope.selectedIndex = index + ((index != $scope.menuData.length - 1) ? 1 : 0);
    }
    // tab selection function
    $scope.tabClicked = function (menu) {
        $scope.menuSelectedValue = menu;
    }
    $scope.proceed = function () {
        $rootScope.personal = true;
        $rootScope.Sources = [{ name: '', url: '' }];
        //Inorder to have a message stating fetch details
        $rootScope.proc = []; // An array which holds the data 
        // To iterate the menudata(menudata-- Linkedin, bloomberg)
        angular.forEach($scope.menuData, function (item, key) {
            $rootScope.proc.push({
                "industry": item,
                "url":($scope.rootPersonalDetails[item][$scope.selectedprofiledata[item]]) ? $scope.rootPersonalDetails[item][$scope.selectedprofiledata[item]].profileurl : null
            });
            console.log($rootScope.proc)
        });
        if ($rootScope.proc.length == 0) {
            alert("Select Profiles")
            $rootScope.LoadingShow = false;
        }   
        else {
           $rootScope.loadingPercentage = 0;
            // StartTimer();
            $rootScope.LoadingShow = true;
            $http.post(server.url + 'getprofile', $scope.proc, {
                headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") } }).then(function (data) {
                $rootScope.LoadingShow = false;
                $rootScope.loadingPercentage = 100;
                $rootScope.profileData = angular.fromJson(data.data.Personal);
                if ($rootScope.profileData['Basic_sources']) {
                    angular.forEach($rootScope.profileData['Basic_sources'], function (iteration, key) {
                            $rootScope.sources.push({
                                 name: $rootScope.profileData['Basic_sources'][key]['name'], 
                                 url: $rootScope.profileData['Basic_sources'][key]['url'] });
                        });
                }
            },function (reason) {
                    $rootScope.LoadingShow = false;
                if (reason.status == 401) {
                        alert('Logout and login, as some user has logged in with the same credentials')
                        $state.go('/');
                    }
                    else{
                        alert('Session time out.')
                    }
                });
              
            $state.go('personal', { 'project': $stateParams.project, 'company': $stateParams.company, 'industry': $stateParams.industry });
            
        }
    } // Service Ends
    // Inorder to set condition for showing main and personal pages
    // var Timer;
    // $rootScope.loadingPercentage = 0;
    // function StartTimer() { Timer = $interval(function () { $rootScope.loadingPercentage++; if ($rootScope.loadingPercentage >= 95) { StopTimer(); } }, 600); }
    // function StopTimer() { if (angular.isDefined(Timer)) { $interval.cancel(Timer); } }
}
