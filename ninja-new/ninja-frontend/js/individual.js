angular.module('individual', ['ngMaterial']).controller('individual_controller', individual_controller);
function individual_controller($http, $stateParams, $rootScope, $scope, $state, $mdDialog, server) {
    //  service for getting complete profile of the person
    $rootScope.selectedMenu = 'main';
    $rootScope.hidesource = true;
    $rootScope.personal = true;
    $rootScope.sources = [];
    $rootScope.flag = 1;
    $scope.makedisable = false;
    $rootScope.sources = [];
    $scope.personaldatavalue = [];
    $scope.personaldatamenu = [];
    $rootScope.messageforindividual = '';
    $rootScope.modulename = 'Individual Module';
    // StopTimer();
    // for getting a pop up
    $scope.showAlert = function (ev) {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Description')
                .textContent(ev)
                .ariaLabel('Alert Dialog Demo')
                .ok('CLOSE')
                .targetEvent(ev)
        );
    };
    if ($rootScope.profileData['Basic_sources']) {
        angular.forEach($rootScope.profileData['Basic_sources'], function (iteration, key) {
            angular.forEach(iteration, function (item, key1) {
                $rootScope.sources.push({ 
                    name: $rootScope.profileData['Basic_sources'][key]['name'],
                     url: $rootScope.profileData['Basic_sources'][key]['url'] });
            });
        });
    }
    $scope.sources = function (item) {
        $rootScope.sources = [];
        if (item == $rootScope.profileData['Basic_sources']) {
            angular.forEach($rootScope.profileData['Basic_sources'], function (iteration, key) {
                    $rootScope.sources.push({ 
                        name: $rootScope.profileData['Basic_sources'][key]['name'] , 
                        url: $rootScope.profileData['Basic_sources'][key]['url'] });
            });
        }
       else if (item == $rootScope.profileData['Education_sources']) {
            angular.forEach($rootScope.profileData['Education_sources'], function (iteration, key) {
                    $rootScope.sources.push({ 
                        name: $rootScope.profileData['Education_sources'][key]['name'], 
                        url: $rootScope.profileData['Education_sources'][key]['url'] });
            });
        }
      else  if (item == $rootScope.profileData['Personal_sources']) {
            angular.forEach($rootScope.profileData['Personal_sources'], function (iteration, key) {
                    $rootScope.sources.push({
                        name: $rootScope.profileData['Personal_sources'][key]['name'], 
                        url: $rootScope.profileData['Personal_sources'][key]['url'] });
            });
        }
     else  if (item == $rootScope.profileData['Interests_sources']) {
            angular.forEach($rootScope.profileData['Interests_sources'], function (iteration, key) {
                    $rootScope.sources.push({ 
                        name: $rootScope.profileData['Interests_sources'][key]['name'], 
                        url: $rootScope.profileData['Interests_sources'][key]['url'] });
            });
        }
    }
    // $rootScope.profileData = [];
    $scope.baseToDocx = function () {
        if ($rootScope.profileData == null || $rootScope.profileData == []) { alert('Services still fetching data, it will take some time.'); }
        else {
            var DT = [];
            DT.push($rootScope.profileData);
            var docdata = {
                "data": DT,
                "data_for": 2
            }
            $http.post(server.url + 'get_word_document', docdata,
                {
                    headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") }
                }).then(function (data) {
                    var a, base64, uri = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,';
                    a = document.createElement('a');
                    a.href = uri + data.data.personal_document;
                    a.target = '_blank';
                    a.download = 'Individual Profile - ' + $rootScope.profileData.Name ? $rootScope.profileData.Name : 'Document' + '.docx';
                    document.getElementsByTagName('body')[0].appendChild(a); // #111
                    a.click();
                    a.remove();
                }, function (reason) {
                   if (reason.status == 401) {
                        alert('Logout and login, as some user has logged in with the same credentials')
                        $state.go('/');
                    }
                    else{
                        alert('Session time out.')
                    }
                });
        }
    };
    // var Timer;
    // $rootScope.loadingPercentage = 0;
    // function StartTimer() { Timer = $interval(function () { $rootScope.loadingPercentage++; if ($rootScope.loadingPercentage >= 95) { StopTimer(); } }, 600); }
    // function StopTimer() { if (angular.isDefined(Timer)) { $interval.cancel(Timer); } }
}