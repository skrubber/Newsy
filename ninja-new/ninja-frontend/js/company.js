angular.module('company', ['ngMaterial']).controller('company_controller', company_controller);
function company_controller($http, $stateParams, $state, $scope, $rootScope, server, $interval) {
    $rootScope.selectedMenu = 'company';
    $rootScope.Companymodulescreen = false;
    $rootScope.selectedCompanyIndex = [];
    $rootScope.hidesource = true;
    $rootScope.LoadingShow = false;
    $rootScope.sources = [];
    var count = 0;
    $scope.active = false;
    $scope.active1 = false;
    $scope.active2 = false;
    $scope.message = false;
    $rootScope.companydetails = null;
    companyflag = false;
    $rootScope.messageforindividual = '';
    $scope.rootcompanynames = '';
    $scope.searchmenu = [];
    $scope.menuData = [];
    $scope.menuSelectedValue = [];
    $scope.selectedProfile = {};
    $scope.companytabsmenu = [];
    $scope.companydatamenu = [];
    $rootScope.datavalue = [];
    $scope.tabname = '';
    $rootScope.modulename = 'Company Module';
    $scope.companytabsmenu = ["Overview", "Acquisitions", "Investments", "Funds Raised", "Financials", "Strategic Focus", "Annual Reports & Earning Calls", "News", "Employer Rating", "New Product/Services", "Leadership"];
    for (i = 0; i < $scope.companytabsmenu.length; i++) {
        $scope.companydatamenu.push($scope.companytabsmenu[i]);
    }
    $scope.companydatavalue = $scope.companydatamenu[0];
    $scope.mainToolbarChange = function (index) {
        $scope.companydatavalue = $scope.companydatamenu[index];
    }
    if ($stateParams.company == 'null' || $stateParams.company == undefined || $stateParams.company == '') {
        alert("Enter Company Name");
        $scope.nocompanydata = true;
    } else if ($stateParams.company) {
        $rootScope.Companymodulescreen = true;
        $rootScope.LoadingShow = true;
        $scope.company = JSON.parse($stateParams.company).Symbol;
        $scope.value = JSON.parse($stateParams.company).isprivate;
        if ($scope.company != '' || ($scope.company == '' && $rootScope.searchvalue == 'Suggestions') || ($scope.company == '' && $scope.value)) {
            // StartTimer();
            $rootScope.LoadingShow = true;
            var companysearchdata = {
                "name": $stateParams.project,
                "_id": $rootScope.valueSelectedFromSugg ? $rootScope.valueSelectedFromSugg['_id'] : JSON.parse($stateParams.company)._id,
                'data_for': 1
            }
            // console.log(companysearchdata)
            $http.post(server.url + 'search', companysearchdata, {
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem("Auth_Token")
                }

            }).then(function (data) {
                annualreports();
                $rootScope.LoadingShow = false;
                $rootScope.flag = 0;
                $rootScope.companydetails = data.data.Company;
                $scope.overviewtab = $rootScope.companydetails['Overview_tab'];
                $scope.investmenttab = $rootScope.companydetails['Investments_tab'];
                $scope.fundstab = $rootScope.companydetails['Funds_raised_tab'];
                if($scope.fundstab['Funding'] != undefined && $scope.fundstab['Funding rounds'] != undefined){
                    $scope.funding = $scope.fundstab['Funding'] + $scope.fundstab['Funding rounds'];
                }
               else if($scope.fundstab['Funding'] != undefined){
                $scope.funding = $scope.fundstab['Funding']
               }
               else{
                $scope.funding =  $scope.fundstab['Funding rounds']; 
               }
                $scope.company_document = data.data.company_document;
                $rootScope.LoadingShow = false;
                if ($rootScope.companydetails['Overview_Sources']) {
                    angular.forEach($rootScope.companydetails['Overview_Sources'], function (iteration, key) {
                        $rootScope.sources.push({
                            name: $rootScope.companydetails['Overview_Sources'][key]['name'],
                            url: $rootScope.companydetails['Overview_Sources'][key]['url']
                        });
                    });
                }

            }, function (reason) {
                $rootScope.LoadingShow = false;
                if (reason.status == 500) {
                    alert("Server error.  Please restart");
                } else if (reason.status == 401) {
                    alert('Logout and login, as some user has logged in with the same credentials')
                    $state.go('/');
                }
                // StopTimer();
            });
        } else {
            // StartTimer();
            $http.post(server.url + 'processcompany', $rootScope.proc1, {
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem("Auth_Token")
                }
            })
                .then(function (data) {
                    $rootScope.loadingPercentage = 100;
                    $rootScope.flag = 0;
                    annualreports();
                    $rootScope.companydetails = data.data;
                    $scope.overviewtab = $rootScope.companydetails['Overview_tab'];
                    $scope.investmenttab = $rootScope.companydetails['Investments_tab'];
                    $scope.fundstab = $rootScope.companydetails['Funds_raised_tab'];
                    console.log($scope.fundstab)
                    $scope.funding = $scope.fundstab['Funding'] + $scope.fundstab['Funding rounds'];
                    if($scope.fundstab['Funding'] != undefined && $scope.fundstab['Funding rounds'] != undefined){
                        $scope.funding = $scope.fundstab['Funding'] + $scope.fundstab['Funding rounds'];
                    }
                   else if($scope.fundstab['Funding'] != undefined){
                    $scope.funding = $scope.fundstab['Funding']
                   }
                   else{
                    $scope.funding =  $scope.fundstab['Funding rounds']; 
                   }
                    $scope.company_document = data.data.company_document;
                    $rootScope.LoadingShow = false;
                    if ($rootScope.companydetails['Overview_Sources']) {
                        angular.forEach($rootScope.companydetails['Overview_Sources'], function (iteration, key) {
                            angular.forEach(iteration, function (item, key1) {
                                $rootScope.sources.push({
                                    name: key1,
                                    url: $rootScope.companydetails['Overview_Sources'][key][key1]
                                });
                            });
                        });
                    }
                }, function (reason) {
                    $rootScope.LoadingShow = false;
                    if (reason.status == 500) {
                        alert("Server error.  Please restart");
                    } else if (reason.status == 401) {
                        alert('Logout and login, as some user has logged in with the same credentials')
                        $state.go('/');
                    }

                });
            // StopTimer();
        }
    }

    $scope.sources = function (item) {
        $rootScope.sources = [];
        if (item == $rootScope.companydetails['Overview_Sources']) {
            $scope.active = false;
            $scope.active1 = false;
            $scope.active2 = false;
            angular.forEach($rootScope.companydetails['Overview_Sources'], function (iteration, key) {
                $rootScope.sources.push({
                    name: $rootScope.companydetails['Overview_Sources'][key]['name'],
                    url: $rootScope.companydetails['Overview_Sources'][key]['url']
                });
            });
        } else if (item == $rootScope.companydetails['Aquisitions_Sources']) {
            $scope.active = true;
            $scope.active1 = false;
            $scope.active2 = false;
            angular.forEach($rootScope.companydetails['Aquisitions_Sources'], function (iteration, key) {

                $rootScope.sources.push({
                    name: $rootScope.companydetails['Aquisitions_Sources'][key]['name'],
                    url: $rootScope.companydetails['Aquisitions_Sources'][key]['url']
                });
            });
        } else if (item == $rootScope.companydetails['Investments_Sources']) {
            $scope.active1 = true;
            $scope.active = false;
            $scope.active2 = false;
            angular.forEach($rootScope.companydetails['Investments_Sources'], function (iteration, key) {
                $rootScope.sources.push({
                    name: $rootScope.companydetails['Investments_Sources'][key]['name'],
                    url: $rootScope.companydetails['Investments_Sources'][key]['url']
                });
            });

        }
        else if (item == $rootScope.companydetails['funding_Sources']) {
            $scope.active2 = true;
            $scope.active1 = false;
            $scope.active = false;
            angular.forEach($rootScope.companydetails['funding_Sources'], function (iteration, key) {
                $rootScope.sources.push({
                    name: $rootScope.companydetails['funding_Sources'][key]['name'],
                    url: $rootScope.companydetails['funding_Sources'][key]['url']
                });
            });
        } else if (item == $rootScope.companydetails['Financials_Sources']) {
            $scope.active2 = false;
            $scope.active1 = false;
            $scope.active = false;
            angular.forEach($rootScope.companydetails['Financials_Sources'], function (iteration, key) {
                $rootScope.sources.push({
                    name: $rootScope.companydetails['Financials_Sources'][key]['name'],
                    url: $rootScope.companydetails['Financials_Sources'][key]['url']
                });
            });
        } else if (item == $rootScope.companydetails['review_sources']) {
            $scope.active2 = false;
            $scope.active1 = false;
            $scope.active = false;
            angular.forEach($rootScope.companydetails['review_sources'], function (iteration, key) {

                $rootScope.sources.push({
                    name: $rootScope.companydetails['review_sources'][key]['name'],
                    url: $rootScope.companydetails['review_sources'][key]['url']
                });
            });
        } else if (item == $rootScope.companydetails['leadership_sources']) {
            $scope.active2 = false;
            $scope.active1 = false;
            $scope.active = false;
            angular.forEach($rootScope.companydetails['leadership_sources'], function (iteration, key) {
                $rootScope.sources.push({
                    name: $rootScope.companydetails['leadership_sources'][key]['name'],
                    url: $rootScope.companydetails['leadership_sources'][key]['url']
                });
            });
        }
    };
    if ($scope.companydetails2 == []) {
        $rootScope.sources = [];
    }
    $scope.companydetails2 = null;
    $scope.annualreports = function () {
        if (count == 0) { }
    }

    function annualreports() {
        $scope.message = true;
        var reportsdata = {
            "name": $stateParams.project,
            "_id": JSON.parse($stateParams.company)._id,
            'data_for': 3
        }
        //  console.log(reportsdata)
        $http.post(server.url + 'search', reportsdata, {
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("Auth_Token")
            }
        }).then(function (data) {
            $scope.message = false;
            $scope.companydetails2 = data.data.Company;
            $scope.newstab = $scope.companydetails2['News'];
            $scope.strategic_focus = $scope.companydetails2['Strategic Focus']
        }, function (reason) {
            $scope.companydetails2 = [];
            if (reason.status == 401) {
                alert('Logout and login, as some user has logged in with the same credentials')
                $state.go('/');
            } else {
                alert('Server error.  Please restart.')
            }
        });
    }
    $scope.sources1 = function (item) {
        $rootScope.sources = [];
        if (item == $scope.companydetails2['Np_sources']) {
            $scope.active2 = false;
            $scope.active1 = false;
            $scope.active = false;
            angular.forEach($scope.companydetails2['Np_sources'], function (iteration, key) {
                $rootScope.sources.push({
                    name: $scope.companydetails2['Np_sources'][key]['name'],
                    url: $scope.companydetails2['Np_sources'][key]['url']
                });
            });
        }
        if (item == $scope.companydetails2['Ar_Sources']) {
            $scope.active2 = false;
            $scope.active1 = false;
            $scope.active = false;
            angular.forEach($scope.companydetails2['Ar_Sources'], function (iteration, key) {
                $rootScope.sources.push({
                    name: $scope.companydetails2['Ar_Sources'][key]['name'],
                    url: $scope.companydetails2['Ar_Sources'][key]['url']
                });
            });
        } else if (item == $scope.companydetails2['C_level_Sources']) {
            $scope.active2 = false;
            $scope.active1 = false;
            $scope.active = false;
            angular.forEach($scope.companydetails2['C_level_Sources'], function (iteration, key) {
                $rootScope.sources.push({
                    name: $scope.companydetails2['C_level_Sources'][key]['name'],
                    url: $scope.companydetails2['C_level_Sources'][key]['url']
                });
            });
        }
    }
    $scope.baseToDocx = function () {
        if ($rootScope.companydetails == null || $rootScope.companydetails == [] || $scope.companydetails2 == null || $scope.companydetails2 == []) {
            alert('Services still fetching data, it will take some time.');
        } else {
            var DT = [];
            DT.push($rootScope.companydetails);
            DT.push($scope.companydetails2);
            var companydocdata = {
                "data": DT,
                "data_for": 1
            }
            $http.post(server.url + 'get_word_document', companydocdata, {
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem("Auth_Token")
                }
            }).then(function (data) {
                var a, base64, uri = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,';
                a = document.createElement('a');
                a.href = uri + data.data.company_document;
                a.target = '_blank';
                a.download = 'Company Profile - ' + JSON.parse($stateParams.company).Company + '.docx';
                document.getElementsByTagName('body')[0].appendChild(a); // #111
                a.click();
                a.remove();
            }, function (reason) {
                if (reason.status == 401) {
                    alert('Logout and login, as some user has logged in with the same credentials')
                    $state.go('/');
                } else {
                    alert('Server error.  Please restart.')
                }
            });
        }
    };
    var Timer;
    $rootScope.loadingPercentage = 0;

    function StartTimer() {
        Timer = $interval(function () {
            $rootScope.loadingPercentage++;
            if ($rootScope.loadingPercentage >= 95) {
                StopTimer();
            }
        }, 1000);
    }

    function StopTimer() {
        if (angular.isDefined(Timer)) {
            $interval.cancel(Timer);
        }
    }
}