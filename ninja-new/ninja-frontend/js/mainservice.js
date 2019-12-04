var mainApp = angular.module("ninjaservice", []);
mainApp.factory('ninjaservice', function ($http, $rootScope, $q) {
var responseobject = {};

responseObject.getindividualsearch = function (personaldata) {
    var defer = $q.defer();
    $http.post(server.url + 'search', personaldata,
    {
        headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") }
    }).then(function (data) {
        defer.resolve(response);
    });
    return defer.promise;
}
});