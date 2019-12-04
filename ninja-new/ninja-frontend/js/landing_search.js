angular.module('landing_search', ['ngMaterial']).controller('landing_search_controller', landing_search_controller);
function landing_search_controller($timeout, $q, $log, $http, $state, $rootScope, $scope, server, $stateParams, $mdDialog, $window) {
    $rootScope.valueSelectedFromSugg = undefined;
    var self = this;
    self.activeurl =false;
    self.companydiv = false;
    self.persondiv = false;
    self.industrydiv = false;
    $rootScope.LoadingShow = false;
    $scope.isActive = false;
    $scope.isActive1 = false;
    $scope.isActive2 = false;
    self.openCompanySelect = function () { self.project.company = null; };
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    $scope.message = false;
    $scope.message1 = false;
    function querySearch(query) {
        var deferred = $q.defer();
        if (!query) deferred.reject();
        var query = {
            "company": query
        }
        $http.post(server.url + 'autocomplete', query,
            {
                headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") }
            }).then(function (data) {
                deferred.resolve(data.data);
            },
                function (reason) {
                    deferred.reject();
                    if (reason.status == 401) {
                        alert('Logout and login, as some user has logged in with the same credentials');
                        $state.go('/');
                    }

                });
        return deferred.promise;
    }
    self.companysearch = function () {
        $scope.isActive = !$scope.isActive;
         $scope.isActive1 = false;
         $scope.isActive2 = false;
        self.companydiv = true;
        self.persondiv = false;
        self.industrydiv = false;
    }
    self.personsearch = function () {
        $scope.isActive = false;
        $scope.isActive2 = false;
        $scope.isActive1 = !$scope.isActive1;
        self.persondiv = true;
        self.companydiv = false;
        self.industrydiv = false;
    }
    self.industrysearch = function () {
        $scope.isActive = false;
        $scope.isActive1 = false;
        $scope.isActive2 = !$scope.isActive2;
        $window.location.href ='http://172.16.0.95:8083' ; 
       
    }
    self.hideform = function () {
        self.companydiv = false;
        self.persondiv = false;
        self.industrydiv = false;
    }
$scope.username = localStorage.getItem("userName")
    self.showAdvanced = function(ev) {

        $mdDialog.show({
            clickOutsideToClose: false,
            controller: function ($scope) {
                $scope.cancel = function () { $mdDialog.cancel(); }

                $scope.logout = function(){
                    localStorage.clear();
                    $http.post('http://172.16.0.95:40004/rest-auth/logout/',  {         
                        headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") }
                    }).then(function (data) {
                        $state.go('/'); 
                        $mdDialog.cancel();
                    }, function (reason) {});   }
            },
            templateUrl: 'dialog1.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            fullscreen: true
        })
        return undefined;
      };
    function searchTextChange(text) { }

    function selectedItemChange(item) { }
    self.searchdetails = function (form) {
        if (self.industry == null && self.name == '' && self.selectedItem == null && (self.searchText == null || self.searchText == '')) {
            alert("Select Any Value");
        }
        else {
            if (self.industry == 'Commercial Real Estate' || self.industry == 'Financials' || self.industry == 'Technology' && self.industry != null) {
                $state.go('industry', { 'project': self.name, 'company': JSON.stringify(self.selectedItem), 'industry': self.industry });
            }
            else {
                if (self.selectedItem == null && self.searchText !== null && self.searchText !== '') {
                    self.selectedItem = { "index": '', "_id": self.searchText, "Company": self.searchText, "Symbol": '', "Stock_exchange": '', "display_string": self.searchText };
                }
                if ((!(self.name) && self.selectedItem)) {
                    if (self.selectedItem.Symbol == '' && !self.selectedItem.isprivate) {
                        $state.go('intermediate', { 'project': self.name, 'company': JSON.stringify(self.selectedItem), 'industry': self.industry });
                    }
                    else {
                        $state.go('company', { 'project': self.name, 'company': JSON.stringify(self.selectedItem), 'industry': self.industry });
                    }
                }
                else if ((self.name && self.selectedItem)) { $state.go('main', { 'project': self.name, 'company': JSON.stringify(self.selectedItem), 'industry': self.industry }); }
            }

        }
    };
}
