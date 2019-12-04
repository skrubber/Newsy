angular.module('intermediate', ['ngMaterial']).controller('intermediate_controller', intermediate_controller);
function intermediate_controller($http, $stateParams, $state, $scope, $rootScope, server, $interval, $mdDialog) {
    $rootScope.selectedMenu = 'company';
    $rootScope.Companymodulescreen = false;
    $rootScope.hidesource = false;
    $rootScope.sources = [];
    $rootScope.modulename = 'Company Module';
    $rootScope.selectedCompanyIndex = {};
    $rootScope.LoadingShow = false;
    $scope.rootcompanynames = [];
    $rootScope.proc1 = [];
    $rootScope.searchmenu = [];
    $rootScope.companyjson = [];
    $scope.selectedProfile = {};
    $scope.menuData = [];
    $rootScope.intermediateresults = [];
    var DT = $rootScope.valueSelectedFromSugg;
    $scope.tabClicked = function (menu) {
        $scope.menuSelectedValue = menu;
    }
    $scope.searchresults = ['Suggestions', 'Web Search'];
    for (i = 0; i < $scope.searchresults.length; i++) {
        $rootScope.searchmenu.push($scope.searchresults[i]);
    }
    $rootScope.searchvalue = $scope.searchmenu[0];
    Suggestiondata();
    function Suggestiondata() {
        // StartTimer();
        $rootScope.LoadingShow = true;
        var searchdataforsuggestions = {
            "_id": JSON.parse($stateParams.company)._id,
            'data_for': 4
        }
        $rootScope.selectedCompanyIndex = {};
        $http.post(server.url + 'search', searchdataforsuggestions, {
            headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") }
        }).then(function (data) {
            $rootScope.LoadingShow = false;
            $scope.rootcompanynames = data.data;
            if ($scope.rootcompanynames.length == 0) {
                $rootScope.searchvalue = $scope.searchmenu[1];
                // StopTimer();
                websearch();
            }
            // StopTimer();
        }, function (reason) {
            $rootScope.LoadingShow = false;
            if (reason.status == 500) { alert("Session Time Out"); }
            else if (reason.status == 401) {
                alert('Logout and login, as some user has logged in with the same credentials')
                $state.go('/');
            }
            // StopTimer();
        });
    }
    function websearch() {
        // StartTimer();
        $rootScope.searchvalue = 'Web Search';
        $rootScope.LoadingShow = true;
        // $rootScope.loadingPercentage = 0;
        var websearchdata = {
            "_id": JSON.parse($stateParams.company)._id,
            'data_for': 1,
            'type': 'websearch'
        }
        $rootScope.intermediateresults = [];
        $http.post(server.url + 'search', websearchdata, {
            headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") }
        }).then(function (data) {
            $rootScope.intermediateresults = data.data.Company;
            $rootScope.LoadingShow = false;
            angular.forEach($rootScope.intermediateresults, function (item, key) {
                $scope.selectedProfile[key] = null;
                if (key != 'Company' && key != 'Company type' && $scope.menuData.indexOf(key) === -1) $scope.menuData.push(key);
            });
            $scope.menuSelectedValue = $scope.menuData[0];
            // StopTimer();
        }, function (reason) {
            $rootScope.LoadingShow = false;
            if (reason.status == 500) {
                alert("Session time out");
            }
            else if (reason.status == 401) {
                alert('Logout and login, as some user has logged in with the same credentials')
                $state.go('/');
            }
            // StopTimer();
        });
    }
    $scope.images = {
        'Crunchbase': 'images/icons/icons/BB21F77.png',
        'LinkedIn': 'images/icons/icons/linkedin_icon.png',
        'Glassdoor': 'images/icons/icons/images.png'
    }
    $scope.mainToolbarChange = function (index) {
        $rootScope.searchvalue = $rootScope.searchmenu[index];
        if ($rootScope.searchvalue == 'Web Search') {
            websearch();
        }
    }
    $scope.menuChange = function (index) {
        $scope.selectedIndex = index + ((index != $scope.menuData.length - 1) ? 1 : 0);
    }
    $scope.websearch1 = function () {
        websearch();
    }
    $scope.getcompanylist = function (selecteddata) {
        if (selecteddata == undefined) { alert("Select the company and then click on next"); }
        else {
            $rootScope.searchvalue = 'Suggestions';
            $rootScope.valueSelectedFromSugg = selecteddata;
            $state.go('company', { 'project': $stateParams.project, 'company': JSON.stringify(selecteddata), 'industry': '' });
        }
    }
    $scope.proceedfinal = function (ev) {
        $rootScope.Companymodulescreen = true;
        $rootScope.companyjson = { "index": '', "Company": $rootScope.intermediateresults.Company, "Symbol": '', "Stock_exchange": '', "display_string": $rootScope.intermediateresults.Company };
        $rootScope.proc1 = []; // An array which holds the data 
        var company = { 'Glassdoor': null, 'LinkedIn': null, 'Crunchbase': null };
        angular.forEach($scope.menuData, function (item, key) {
            $rootScope.proc1.push({
                "industry": item,
                "url": $rootScope.intermediateresults[item][$scope.selectedProfile[item]]
            });
        });
        $rootScope.proc1.forEach(item => { console.log(item); company[item.industry] = item.url != undefined ? true : false; });
      //  console.log(company);
        if (company['LinkedIn'] && company['Crunchbase'] && company['Glassdoor']) {
            $state.go('company', { 'project': $stateParams.project, 'company': JSON.stringify($rootScope.companyjson), 'industry': '' });
        }
        else if (company['Glassdoor'] && company['LinkedIn'] == null && company['Crunchbase'] == null) {
            $state.go('company', { 'project': $stateParams.project, 'company': JSON.stringify($rootScope.companyjson), 'industry': '' });
        }
        else if (company['Glassdoor'] == null && company['LinkedIn'] && company['Crunchbase'] == null) {
            $state.go('company', { 'project': $stateParams.project, 'company': JSON.stringify($rootScope.companyjson), 'industry': '' });
        }
        else if (company['Glassdoor'] == null && company['LinkedIn'] == null && company['Crunchbase']) {
            $state.go('company', { 'project': $stateParams.project, 'company': JSON.stringify($rootScope.companyjson), 'industry': '' });
        }
         else if (company['Glassdoor'] && company['LinkedIn'] && company['Crunchbase'] == null) {
            $state.go('company', { 'project': $stateParams.project, 'company': JSON.stringify($rootScope.companyjson), 'industry': '' });
        }
        else if (company['Glassdoor'] && company['LinkedIn'] == null && company['Crunchbase']) {
            $state.go('company', { 'project': $stateParams.project, 'company': JSON.stringify($rootScope.companyjson), 'industry': '' });
        }
        else if (company['Glassdoor'] == null && company['LinkedIn'] && company['Crunchbase']) {
            $state.go('company', { 'project': $stateParams.project, 'company': JSON.stringify($rootScope.companyjson), 'industry': '' });
        }
        else if (company['Glassdoor'] == false && company['LinkedIn'] && company['Crunchbase'] == null) {
            $scope.showAdvanced(true, ev, 'You have selected LinkedIn profile of the company. To proceed with your selection click <b>"ok"</b> or else click <b>"cancel"</b> to select Glassdoor profile');
        }
        else if (company['Glassdoor'] == false && company['LinkedIn']==null && company['Crunchbase']) {
            $scope.showAdvanced(true, ev, 'You have selected Crunchbase profile of the company. To proceed with your selection click <b>"ok"</b> or else click <b>"cancel"</b> to select Glassdoor profile');
        }
        else if (company['Glassdoor'] == null && company['LinkedIn']==false && company['Crunchbase']) {
            $scope.showAdvanced(true, ev, 'You have selected Crunchbase profile of the company. To proceed with your selection click <b>"ok"</b> or else click <b>"cancel"</b> to select LinkedIn profile');
        }
        else if (company['Glassdoor'] == null && company['LinkedIn'] && company['Crunchbase'] == false) {
            $scope.showAdvanced(true, ev, 'You have selected LinkedIn profile of the company. To proceed with your selection click <b>"ok"</b> or else click <b>"cancel"</b> to select Crunchbase profile');
        }
        else if (company['Glassdoor'] && company['LinkedIn'] == null && company['Crunchbase'] == false) {
            $scope.showAdvanced(false, ev, 'Please select Crunchbase profile of the company to proceed further');
        }
        else if (company['Glassdoor'] && company['LinkedIn'] == false && company['Crunchbase'] == null) {
            $scope.showAdvanced(false, ev, 'Please select LinkedIn profile of the company to proceed further');
        }
        else if ((company['Glassdoor']) && (company['LinkedIn'] || company['Crunchbase'])) {
            if (company['LinkedIn'] && !(company['Crunchbase'])) {
                $scope.showAdvanced(true, ev, 'You have selected LinkedIn and Glassdoor profiles of the company. To proceed with your selection click <b>"ok"</b> or else click <b>"cancel"</b> to select Crunchbase profile');
            }
            else if (!(company['LinkedIn']) && (company['Crunchbase'])) {
                $scope.showAdvanced(true, ev, 'You have selected Crunchbase and Glassdoor profiles of the company. To proceed with your selection click <b>"ok"</b> or else click <b>"cancel"</b> to select LinkedIn profile');
            }
        }
        else if ((company['Glassdoor']) && !(company['LinkedIn']) && !(company['Crunchbase'])) {
            $scope.showAdvanced(false, ev, 'Please select Crunchbase or LinkedIn profile of the company to proceed further');
        }
        else if (!(company['Glassdoor']) && company['LinkedIn'] && company['Crunchbase']) {
            $scope.showAdvanced(true, ev, 'You have selected  LinkedIn and Crunchbase profiles of the company. To proceed with your selection click <b>"ok"</b> or else click <b>"cancel"</b> to select Glassdoor profile');
        }
        else if (!(company['Glassdoor']) && !company['LinkedIn'] && company['Crunchbase']) {
            $scope.showAdvanced(true, ev, 'You have selected only Crunchbase profile of the company. To proceed with your selection click <b>"ok"</b> or else click <b>"cancel"</b> to select LinkedIn and Glassdoor profiles');
        }
        else if (!(company['Glassdoor']) && company['LinkedIn'] && !company['Crunchbase']) {
            $scope.showAdvanced(true, ev, 'You have selected only LinkedIn profile of the company. To proceed with your selection click <b>"ok"</b> or else click <b>"cancel"</b> to select Crunchbase and Glassdoor profiles');
        }
        else {
            $scope.showAdvanced(false, ev, 'Select profiles');
        }

    }
    var Timer;
    $rootScope.loadingPercentage = 0;
    function StartTimer() {
        Timer = $interval(function () {
            $rootScope.loadingPercentage++;
            if ($rootScope.loadingPercentage >= 95) { StopTimer(); }
        }, 1000);
    }
    function StopTimer() { if (angular.isDefined(Timer)) { $interval.cancel(Timer); } }
    $scope.showAdvanced = function (is_redirect, ev, msg) {
        $mdDialog.show({
            clickOutsideToClose: false,
            controller: function ($scope) {
                $scope.is_redirect = is_redirect;
                $scope.msg = msg;
                $scope.cancel = function () { $mdDialog.cancel(); }
                $scope.proceed = function () {
                    $mdDialog.cancel();
                    if (is_redirect) {
                        $state.go('company', { 'project': $stateParams.project, 'company': JSON.stringify($rootScope.companyjson), 'industry': '' });
                    }
                }
            },
            templateUrl: './views/company/popup.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            fullscreen: true
        })
        return undefined;
    };
}
