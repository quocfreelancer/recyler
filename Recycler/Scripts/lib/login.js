/**
 * Login view model
 */

var app = window.app = window.app || {};
app.currentPosition = null;
app.password = null;
app.Username = null;
app.isLoggedInFB = false;
app.Login = (function () {
    'use strict';

    var loginViewModel = (function () {

        var isInMistSimulator = (location.host.indexOf('icenium.com') > -1);

        var $loginUsername;
        var $loginPassword;

        var isFacebookLogin = app.isKeySet(appSettings.facebook.appId) && app.isKeySet(appSettings.facebook.redirectUri);
        var isGoogleLogin = app.isKeySet(appSettings.google.clientId) && app.isKeySet(appSettings.google.redirectUri);
        var isLiveIdLogin = app.isKeySet(appSettings.liveId.clientId) && app.isKeySet(appSettings.liveId.redirectUri);
        var isAdfsLogin = app.isKeySet(appSettings.adfs.adfsRealm) && app.isKeySet(appSettings.adfs.adfsEndpoint);
        var isAnalytics = analytics.isAnalytics();
        //var isAnalytics = false;

        var init = function () {
            if (!app.isKeySet(appSettings.everlive.apiKey)) {
                app.application.navigate('views/noApiKey.html', 'fade');
            }

            $loginUsername = $('#loginUsername');
            $loginPassword = $('#loginPassword');

            if (!isFacebookLogin) {
                $('#loginWithFacebook').addClass('disabled');
                console.log('Facebook App ID and/or Redirect URI not set. You cannot use Facebook login.');
            }
            if (!isGoogleLogin) {
                $('#loginWithGoogle').addClass('disabled');
                console.log('Google Client ID and/or Redirect URI not set. You cannot use Google login.');
            }
            if (!isLiveIdLogin) {
                $('#loginWithLiveID').addClass('disabled');
                console.log('LiveID Client ID and/or Redirect URI not set. You cannot use LiveID login.');
            }
            /*  if (!isAdfsLogin) {
                  $('#loginWithADSF').addClass('disabled');
                  console.log('ADFS Realm and/or Endpoint not set. You cannot use ADFS login.');
              }
              if (!isAnalytics) {
                  console.log('EQATEC product key is not set. You cannot use EQATEC Analytics service.');
              }*/
        };

        var show = function () {
            $loginUsername.val('');
            $loginPassword.val('');
            // TEST
            //$loginUsername.val("bjarke@bsrweb.dk");
            //$loginPassword.val("Rec0089");
            TranslateApp();
        };

        // Authenticate to use Backend Services as a particular user
        var login = function (user, pass, isNavigateToMemebership) {
            var username, password;


            if (user !== undefined && pass !== undefined) {
                username = user;
                password = pass;
            }
            else {
                username = $loginUsername.val();
                password = $loginPassword.val();
            }


            if (!validateEmail(username)) {
                debugger;
                navigator.notification.alert("You should fill a valid email!", null, "");
                return;
            }

            if (username == "" || password == "") {
                alert("Please, fill username and password!");
                return;
            }


            //  console.log(
            // Authenticate using the username and password
            app.everlive.Users.login(username, password)
            .then(function () {
                // EQATEC analytics monitor - track login type
                if (isAnalytics) {
                    analytics.TrackFeature('Login.Regular');
                }

                return app.Users.load();
            })
            .then(function () {

                localStorage.Username = username;
                localStorage.Password = password;

                app.everlive.Users.currentUser(function (data) {
                    console.log(data.result);
                    app.currentUser = data.result;
                    debugger;
                    var isExpired = false;
                    if (app.currentUser.UserRole == 2) {
                        if (app.currentUser.SupporterType !== undefined) {
                            if (moment().days() > moment(app.currentUser.ExpireSupporterTime)) {
                                isExpired = true;
                            }
                        }
                    }
                    localStorage.User = JSON.stringify(data.result);
                    app.AddActivity.me = data.result;
                    if (!isExpired) {
                        fillUserData(data.result);
                    } else {
                        var ev = app.everlive.data('Users');

                        ev.update({
                            'UserRole': 1,
                            'StartedSupporterTime': null,
                            'ExpireSupporterTime': null,
                            'SupporterType': null,

                        }, // data
                                    { 'Id': app.currentUser.Id }, // filter
                                    function (data1) {
                                        app.everlive.Users.currentUser(function (data2) { fillUserData(data2.result); });
                                    },
                                    function (error) {
                                        alert(JSON.stringify(error));
                                    });
                    }

                    localStorage.Language = data.result.LanguageID;
                    if (localStorage.Language == undefined || localStorage.Language == "undefined") {
                        localStorage.Language = 3;
                        localStorage.LanguageType = "en";
                    }


                    switch (localStorage.Language) {
                        case "1":
                            localStorage.LanguageType = "dk";
                            break;
                        case "2":
                            localStorage.LanguageType = "de";
                            break;
                        case "3":
                            localStorage.LanguageType = "en";
                            break;
                        case "4":
                            localStorage.LanguageType = "es";
                            break;
                        default:
                            localStorage.LanguageType = "en";
                            break;
                    }

                    // get current loction 
                    window.getLocation()
                         .done(function (position) {
                             app.currentPosition = position;

                             if (data.result.Email == undefined || data.result.Email == "")
                                 app.application.navigate('basic_setup.html');
                             else {
                                 if (isNavigateToMemebership)
                                     app.application.navigate("membership.html");
                                 else
                                     app.application.navigate('finditem.html');
                             }
                         })
                         .fail(function (error) {
                             alert(TranslateGpsError());
                             app.currentPosition = null;

                             if (data.result.Email == undefined || data.result.Email == "")
                                 app.application.navigate('basic_setup.html');
                             else {
                                 if (isNavigateToMemebership)
                                     app.application.navigate("membership.html");
                                 else
                                     app.application.navigate('finditem.html');
                             }
                         });


                });
            })
            .then(null,
                  function (err) {
                      // console.log(err);
                      var filter = new Everlive.Query();
                      filter.where().eq('Username', username);


                      app.everlive.Users.get(filter)
                         .then(function (data) {

                             if (data.result.length > 0) { app.showError(err.message); }
                             else {
                                 if (password.length > 0 && username.length > 0)
                                     navigator.notification.confirm(
                                          "This email doesn't exist in our database. Do you want to register with it?", // message
                                           function (button) {
                                               if (button == 1) {
                                                   var attrs = {
                                                       Email: username
                                                   };
                                                   app.password = password;
                                                   app.Username = username;
                                                   app.everlive.Users.register(username, password, attrs, function (data) {
                                                       app.everlive.Users.login(username, password, function () {

                                                           app.everlive.Users.currentUser(
                                                             function (data) {
                                                                 debugger;
                                                                 console.log(data.result);
                                                                 app.Users.currentUser.data = data.result;
                                                                 localStorage.User = JSON.stringify(data.result);
                                                                 fillUserData(data.result);
                                                                 app.application.navigate('basic_setup.html');
                                                             });
                                                       }, function (err) {
                                                           app.showError(err.message);

                                                       });
                                                   },
                                                         function (error) {
                                                             alert(JSON.stringify(error));
                                                         });
                                               }
                                           },
                                        'Register',
                                          ['Register',           // title
                                          'Cancel']        // buttonLabels
                                      );
                                 else app.showError(err.message);
                             }
                         },
                         function (error) {
                             app.showError(err.message);
                         });



                  }
            );
        };

        // Authenticate using Facebook credentials
        var loginWithFacebook = function () {

            if (!isFacebookLogin) {
                return;
            }
            if (isInMistSimulator) {
                showMistAlert();
                return;
            }
            var facebookConfig = {
                name: 'Facebook',
                loginMethodName: 'loginWithFacebook',
                endpoint: 'https://www.facebook.com/dialog/oauth',
                response_type: 'token',
                client_id: appSettings.facebook.appId,
                redirect_uri: appSettings.facebook.redirectUri,
                access_type: 'online',
                scope: 'email',
                display: 'touch'
            };
            var facebook = new IdentityProvider(facebookConfig);
            app.application.showLoading();

            facebook.getAccessToken(function (token) {
                app.everlive.Users.loginWithFacebook(token)
                .then(function () {
                    // EQATEC analytics monitor - track login type
                    if (isAnalytics) {
                        analytics.TrackFeature('Login.Facebook');
                    }

                    app.isLoggedInFB = true;
                    return app.Users.load();
                })
                .then(function () {
                    app.application.hideLoading();
                    app.application.navigate('basic_setup.html');
                })
                .then(null, function (err) {
                    app.application.hideLoading();
                    if (err.code == 214) {
                        app.showError('The specified identity provider is not enabled in the backend portal.');
                    } else {
                        app.showError(err.message);
                    }
                });
            });
        };

        var loginWithGoogle = function () {

            if (!isGoogleLogin) {
                return;
            }
            if (isInMistSimulator) {
                showMistAlert();
                return;
            }
            var googleConfig = {
                name: 'Google',
                loginMethodName: 'loginWithGoogle',
                endpoint: 'https://accounts.google.com/o/oauth2/auth',
                response_type: 'token',
                client_id: appSettings.google.clientId,
                redirect_uri: appSettings.google.redirectUri,
                scope: 'https://www.googleapis.com/auth/userinfo.profile',
                access_type: 'online',
                display: 'touch'
            };
            var google = new IdentityProvider(googleConfig);
            app.application.showLoading();

            google.getAccessToken(function (token) {
                app.everlive.Users.loginWithGoogle(token)
                .then(function () {
                    // EQATEC analytics monitor - track login type
                    if (isAnalytics) {
                        analytics.TrackFeature('Login.Google');
                    }
                    return app.Users.load();
                })
                .then(function () {
                    app.application.hideLoading();
                    app.application.navigate('drawer_telerik.html');
                })
                .then(null, function (err) {
                    app.application.hideLoading();
                    if (err.code == 214) {
                        app.showError('The specified identity provider is not enabled in the backend portal.');
                    } else {
                        app.showError(err.message);
                    }
                });
            });
        };

        var loginWithLiveID = function () {

            if (!isLiveIdLogin) {
                return;
            }
            if (isInMistSimulator) {
                showMistAlert();
                return;
            }
            var liveIdConfig = {
                name: 'LiveID',
                loginMethodName: 'loginWithLiveID',
                endpoint: 'https://login.live.com/oauth20_authorize.srf',
                response_type: 'token',
                client_id: appSettings.liveId.clientId,
                redirect_uri: appSettings.liveId.redirectUri,
                scope: 'wl.basic',
                access_type: 'online',
                display: 'touch'
            };
            var liveId = new IdentityProvider(liveIdConfig);
            app.application.showLoading();

            liveId.getAccessToken(function (token) {
                app.everlive.Users.loginWithLiveID(token)
                .then(function () {
                    // EQATEC analytics monitor - track login type
                    if (isAnalytics) {
                        analytics.TrackFeature('Login.LiveID');
                    }
                    return app.Users.load();
                })
                .then(function () {
                    app.application.hideLoading();
                    app.application.navigate('drawer_telerik.html');
                })
                .then(null, function (err) {
                    app.application.hideLoading();
                    if (err.code == 214) {
                        app.showError('The specified identity provider is not enabled in the backend portal.');
                    } else {
                        app.showError(err.message);
                    }
                });
            });
        };

        var loginWithADSF = function () {

            if (!isAdfsLogin) {
                return;
            }
            if (isInMistSimulator) {
                showMistAlert();
                return;
            }
            var adfsConfig = {
                name: 'ADFS',
                loginMethodName: 'loginWithADFS',
                endpoint: appSettings.adfs.adfsEndpoint,
                wa: 'wsignin1.0',
                wtrealm: appSettings.adfs.adfsRealm
            };
            var adfs = new IdentityProvider(adfsConfig);
            app.application.showLoading();

            adfs.getAccessToken(function (token) {
                app.everlive.Users.loginWithADFS(token)
                .then(function () {
                    // EQATEC analytics monitor - track login type
                    if (isAnalytics) {
                        analytics.TrackFeature('Login.ADFS');
                    }
                    return app.Users.load();
                })
                .then(function () {
                    app.application.hideLoading();
                    app.application.navigate('drawer_telerik.html');
                })
                .then(null, function (err) {
                    app.application.hideLoading();
                    if (err.code == 214) {
                        app.showError('The specified identity provider is not enabled in the backend portal.');
                    } else {
                        app.showError(err.message);
                    }
                });
            });
        };

        var showMistAlert = function () {
            alert(appSettings.messages.mistSimulatorAlert);
        };

        var checkEnter = function (e) {
            var that = this;
            if (e.keyCode === 13) {
                $(e.target).blur();
                app.Login.login();
            }
        }

        var repopulateUserAfterSave = function () {
            app.everlive.Users.currentUser(function (data) {
                console.log(data.result);
                app.currentUser = data.result;

                localStorage.User = JSON.stringify(data.result);
                app.AddActivity.me = data.result;
                fillUserData(data.result);

                localStorage.Language = data.result.LanguageID;
                if (localStorage.Language == undefined || localStorage.Language == "undefined") {
                    localStorage.Language = 3;
                    localStorage.LanguageType = "en";
                }


                switch (localStorage.Language) {
                    case "1":
                        localStorage.LanguageType = "dk";
                        break;
                    case "2":
                        localStorage.LanguageType = "de";
                        break;
                    case "3":
                        localStorage.LanguageType = "en";
                        break;
                    case "4":
                        localStorage.LanguageType = "es";
                        break;
                    default:
                        localStorage.LanguageType = "en";
                        break;
                }

                // get current loction 
                window.getLocation()
                     .done(function (position) {
                         app.currentPosition = position;

                         if (data.result.Email == undefined || data.result.Email == "")
                             app.application.navigate('basic_setup.html');
                         else {
                             app.application.navigate('finditem.html');
                         }
                     })
                     .fail(function (error) {
                         alert(TranslateGpsError());
                         app.currentPosition = null;

                         if (data.result.Email == undefined || data.result.Email == "")
                             app.application.navigate('basic_setup.html');
                         else {
                             app.application.navigate('finditem.html');
                         }
                     });


            });
        }
        return {
            init: init,
            show: show,
            getYear: app.getYear,
            login: login,
            loginWithFacebook: loginWithFacebook,
            loginWithGoogle: loginWithGoogle,
            loginWithLiveID: loginWithLiveID,
            loginWithADSF: loginWithADSF,
            checkEnter: checkEnter,
            repopulateUserAfterSave: repopulateUserAfterSave
        };

    }());

    return loginViewModel;

}());

