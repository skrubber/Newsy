angular.module('ninja', ['ngMaterial']).controller('ninja_controller', ninja_controller);
function ninja_controller($timeout, $q, $log, $http, $state, $rootScope, $stateParams, $scope, server,$mdDialog) {
    $rootScope.sources = [{ name: '', url: '' }];
    $rootScope.hidesource = true;
    var self = this;
    $rootScope.Companymodulescreen = false;
    $rootScope.sidebarmenudata2 = [];
    self.showsidebardata = false;
    self.openCompanySelect = function () { self.project.company = null; };
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    $scope.username = localStorage.getItem("userName")
    function querySearch(query) {
        var deferred = $q.defer();
        $http.post(server.url + 'autocomplete', { "company": query }).then(function (data) { deferred.resolve(data.data); }, function (reason) { deferred.reject(); });
        return deferred.promise;
    }
    self.search = { "companychange": false, "namechange": false, "industrychange": false };
    function searchTextChange(text) {
        if (text != '') self.search.companychange = true;
    }

    function selectedItemChange(item) { console.log(self.selectedItem); }
    self.name = $stateParams.project;
    self.industry = $stateParams.industry;
    self.selectedItem = $stateParams.company;
    self.menu = [
        { url: 'company', name: 'Company', 'visible': (($stateParams.company &&  $stateParams.company != 'null')? true : false), img: 'images/icons/icons/company-2.svg', img1: 'images/icons/icons/company-2.svg' },
        { url: 'main', name: 'Individual', 'visible': (self.name ? true : false), img: 'images/icons/icons/User-icon.svg', img1: 'images/icons/icons/User-icon-black.svg' },
        { url: 'industry', name: 'Industry', 'visible': ( self.industry ? true : false), img: 'images/icons/icons/industry-icon.svg', img1: 'images/icons/icons/industry-icon-black.svg' }
    ];
    console.log($stateParams.company)
    self.showAdvanced = function(ev) {

        $mdDialog.show({
            clickOutsideToClose: false,
            controller: function ($scope) {
                $scope.cancel = function () { $mdDialog.cancel(); }

                $scope.logout = function(){
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


    self.menuChange = function (url) {
        self.selectedItem = JSON.parse($stateParams.company);
        if (url == 'main') {
            if ($rootScope.personal == true) {
                $state.go('personal', { 'project': $stateParams.project, 'company': $stateParams.company, 'industry': $stateParams.industry });
            }
            else {
                $state.go('main', { 'project': $stateParams.project, 'company': $stateParams.company, 'industry': $stateParams.industry });
            }
        }
        else if(url == 'company') {
            if(self.selectedItem.Symbol == '' &&  $rootScope.Companymodulescreen == false){
                $state.go('intermediate', { 'project': self.name, 'company': JSON.stringify(self.selectedItem), 'industry': self.industry }); }                  
            else{
                $state.go('company', { 'project': self.name, 'company': JSON.stringify(self.selectedItem), 'industry': self.industry }); }                  
            }           
        else {
            $state.go(url, { 'project': $stateParams.project, 'company': JSON.stringify(self.selectedItem), 'industry': $stateParams.industry });
        }

    }
   
}