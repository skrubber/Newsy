angular.module('industry', ['ngMaterial']).controller('industry_controller', industry_controller);
function industry_controller($http, $stateParams, $rootScope, $state, $scope, server, $mdDialog) {
    $rootScope.selectedMenu = 'industry';
    $rootScope.hidesource = false;
    $rootScope.hideindustry = true;
    $rootScope.LoadingShow = false;
    $scope.industryscreen = false;
    $scope.loadingmessage1 = false;
    $scope.loadingmessage2 = false;
    $scope.loadingmessage3 = false;
    $scope.loadingmessage4 = false;
    $rootScope.messageforindividual = '';
    $rootScope.modulename = 'Industry Module';
    $scope.screenTitle = $stateParams.industry;
    if ($stateParams.industry === 'Commercial Real Estate' || $stateParams.industry === 'Financials' || $stateParams.industry === 'Technology') {
        $scope.industryscreen = true;
    }
    if ($stateParams.industry == '') {
        $scope.industryscreen = false;
    }
    if ($scope.industryscreen) {
        $scope.searchdetails = function (form) {
            if (($stateParams.industry && $stateParams.industry != 'Industry')) {
                $state.go('industry');
                // $scope.showtab=2;
            }
        }
        $scope.datamenu = [];
        // Industry Tabs
        $scope.industryData = ["Overview", "News & Reports"];// "Companies",
        for (i = 0; i < $scope.industryData.length; i++) {
            $scope.datamenu.push($scope.industryData[i]);
        }
        $scope.datavalue = $scope.datamenu[0];
        $scope.mainToolbarChange = function (index) {
            $scope.datavalue = $scope.datamenu[index]

        }
        //values for time dropdown
        $scope.choosetimeid = [{
            timeid: 0,
            name: "Week"
        },
        {
            timeid: 1,
            name: "2 Weeks"
        },
        {
            timeid: 2,
            name: "Month"
        },
        {
            timeid: 3,
            name: "3 Months"
        },
        {
            timeid: 4,
            name: "6 Months"
        },
        ];
        //values for category dropdown
        $scope.categories = [
            {
                id: 0,
                name: "All"
            },
            {
                id: 1,
                name: "Patents"
            },
            {
                id: 2,
                name: "Contract"
            },
            {
                id: 3,
                name: "M & A"
            },
        ];

        //popup for events
        $scope.showAdvancedpopup = function (ev) {
            $mdDialog.show({
                controller: ($scope, $http, $mdDialog) => {
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                    console.log(ev)
                    $scope.title = ev.name;
                    $scope.subtext = ev.sub_text;
                    $scope.time = ev.time;
                    $scope.heading = ev.category_name;
                    $scope.link = ev.url;
                    $scope.companyname = ev.Company
                },
                templateUrl: 'dialog3.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        };
        $scope.status = '';
        $scope.customFullscreen = false;
        $scope.showAdvanced = function (ev, name) {
            $mdDialog.show({
                controller: ($scope, $http, $mdDialog) => {
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                    $scope.loadingmessage6 = false;
                    $scope.choosetimeid = [{
                        timeid: 0,
                        name: "Week"
                    },
                    {
                        timeid: 1,
                        name: "2 Weeks"
                    },
                    {
                        timeid: 2,
                        name: "Month"
                    },
                    {
                        timeid: 3,
                        name: "3 Months"
                    },
                    {
                        timeid: 4,
                        name: "6 Months"
                    },
                    ];
                    $scope.company_timeid = 1;
                    $scope.companypopup = function (id) {
                        companypopup(id);
                    }
                    companypopup($scope.company_timeid);

                    function companypopup(id) {
                        $scope.loadingmessage6 = true;
                        $scope.list = [];
                        var popup = {
                            "industry_id": $stateParams.industry,
                            "time_id": id,
                            "value": ev,
                            "name": name,
                            "type_id": 0
                        }
                        $http.post(server.url + 'popup', popup,                           
                            {
                                headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") }                               
                           }
                        ).then(function (data) {
                            $scope.loadingmessage6 = false;
                            $scope.list = data.data.news;
                            $scope.nameofthecompany = data.data.name;
                            console.log($scope.nameofthecompany);

                        }, function (reason) {
                            $scope.loadingmessage6 = false;
                           if (reason.status == 401) {
                                alert('Logout and login, as some user has logged in with the same credentials')
                                $state.go('/');
                            } 
                            else{
                                alert('Server Error.')
                            }
                        });
                    }
                },
                templateUrl: 'dialog2.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        };

        $scope.showAdvanced1 = function (ev) {
            $mdDialog.show({
                controller: ($scope, $http, $mdDialog) => {
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                    $scope.loadingmessage5 = false;
                    $scope.choosetimeid = [{
                        timeid: 0,
                        name: "Week"
                    },
                    {
                        timeid: 1,
                        name: "2 Weeks"
                    },
                    {
                        timeid: 2,
                        name: "Month"
                    },
                    {
                        timeid: 3,
                        name: "3 Months"
                    },
                    {
                        timeid: 4,
                        name: "6 Months"
                    },
                    ];
                    $scope.theme_timeid = 1;
                    $scope.themepopup = function (id) {
                        themepopup(id);
                    }
                    themepopup($scope.theme_timeid);

                    function themepopup(id) {
                        $scope.list = [];
                        $scope.loadingmessage5 = true;
                        var newspopup = {
                            "industry_id": $stateParams.industry,
                            "time_id": id,
                            "value": ev,
                            "type_id": 1 
                        }
                        $http.post(server.url + 'popup',newspopup, 
                             {
                                headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") } 
                               
                            }).then(function (data) {
                            $scope.loadingmessage5 = false;
                            $scope.list = data.data.news;
                            $scope.nameofthetheme = ev;

                        }, function (reason) {
                            $scope.loadingmessage5 = false;
                           if (reason.status == 401) {
                                alert('Logout and login, as some user has logged in with the same credentials')
                                $state.go('/');
                            }
                        });             
                    }
                },
                templateUrl: 'dialog1.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        };

        // In trends, for toggling company button
        $scope.Togglecompany = function () {
            $scope.Companytoggle = true;
            $scope.Themes = false;
        }
        // In trends, for toggling themes button
        $scope.themes = function () {
            $scope.Companytoggle = false;
            $scope.Themes = true;
        }
        //Setting up default value and calling service for trends in industry
        $scope.trendingTimeFilter = 1;
        $scope.trending = function (id) {
            trending(id);
        }
        trending($scope.trendingTimeFilter);

        function trending(id) {
            $scope.trendlist = [];
            $scope.loadingmessage4 = true;
            var trendsdata = {
                "industry_id": $stateParams.industry,
                "time_id": id
            }
            $http.post(server.url + 'trends', trendsdata,
            {
                headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") }
            }).then(function (data) {
                $scope.loadingmessage4 = false;
                $scope.trendlist = data.data;
            }, function (reason) {
                $scope.loadingmessage4 = false;
              if (reason.status == 401) {
                    alert('Logout and login, as some user has logged in with the same credentials')
                    $state.go('/');
                }
            });
        }
        //Setting up default value and calling service for Events in industry 
        $scope.eventsTimeFilter = 4;
        $scope.defaultcategoryFilter = 0;
        $scope.news = function (id, value) {
            news(id, value);
        }
        news($scope.eventsTimeFilter, 0);

        function news(id, value) {
            $scope.eventslist = [];
            $scope.loadingmessage3 = true;
            var eventsdata = {
                "industry_id": $stateParams.industry,
                "time_id": id,
                "category_id": value
            }
            $http.post(server.url + 'events', eventsdata, {
                headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") }
            }).then(function (data) {
                $scope.loadingmessage3 = false;
                $scope.eventslist = data.data;
            }, function (reason) {
                $scope.loadingmessage3 = false;
              if (reason.status == 401) {
                    alert('Logout and login, as some user has logged in with the same credentials')
                    $state.go('/');
                }
            });
        }
        // Setting up default value and calling service for Funding Activities in industry
        $scope.fundingActTimeFilter = 4;
        $scope.funding = function (id) {
            funding(id);
        }
        funding($scope.fundingActTimeFilter);

        function funding(id) {
            $scope.fundinglist = [];
            $scope.loadingmessage2 = true;
            var fundingdata = {
                "industry_id": $stateParams.industry,
                "time_id": id
            }
            $http.post(server.url + 'funding', fundingdata,  {
                headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") }
            }).then(function (data) {
                $scope.loadingmessage2 = false;
                $scope.fundinglist = data.data;

            }, function (reason) {
                $scope.loadingmessage2 = false;
             if (reason.status == 401) {
                    alert('Logout and login, as some user has logged in with the same credentials')
                    $state.go('/');
                }
            });
        }
        // Setting up default value and calling service for News & Reports in industry
        $scope.newsreportsTimeFilter = 4;
        $scope.reports = function (id) {
            reports(id);
        }
        reports(4);

        function reports(id) {
            $scope.newslist = [];
            $scope.loadingmessage1 = true;
            var newsdata = {
                "industry_id": $stateParams.industry,
                "time_id": id
            }
            $http.post(server.url + 'news', newsdata,
            {
                headers: { 'Authorization': 'Token ' + localStorage.getItem("Auth_Token") } 
               
            }).then(function (data) {
                $scope.loadingmessage1 = false;
                $scope.newslist = data.data;

            }, function (reason) {
                $scope.loadingmessage1 = false;
            if (reason.status == 401) {
                    alert('Logout and login, as some user has logged in with the same credentials')
                    $state.go('/');
                }
            });
        }
    }
}