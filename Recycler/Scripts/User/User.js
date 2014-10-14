var user = {
    UserID: '',
    Username: '',
    Password: '',
    Email: '',
    FirstName: '',
    CompanyName: '',
    Address: '',
    City: '',
    Zip: '',
    State: '',
    Country: '',
    Language: '',
    RoleID: '',
    image: '',
    MailSent: false,
    Phoneno: '',
    Navigate: 'false',
    blnFlag: 'true',
    Error: '',
    MemberShipID: '',
    MemberShipType: '',
    UpdateSubscription: false,
    SubscriptionPaid: false,
    LanguageMailSent: false,
    CountryCode: '',

    CheckEmailExists: function (UserID, EmailId) {
        $.support.cors = true;
        var data = '{"UserID":"' + UserID + '","EmailID": "' + EmailId + '"}';
        var URLFormed = Service.dataServiceURL + Service.ServiceName._UserService + '/' + Service.ServiceMethods._CheckEmailID;
        $("#LoadingDiv").css({ "position": "absolute", "left": "0px", "top": "0px", 'opacity': '0.8', "z-index": "20002",
            'filter': 'alpha(opacity=40)', "width": "100%", "height": "100%",
            'background-color': 'white'
        });
        $("#Load").css({ "position": "fixed", "z-index": "20003", "top": "50%", "left": "30%" });
        $('#LoadingDiv,#Load').ajaxStart(function () { $('#LoadingDiv,#Load').show(); });
        $('#LoadingDiv,#Load').ajaxComplete(function () { $('#LoadingDiv,#Load').hide(); });

        $.ajax({
            type: "POST",
            url: URLFormed,
            dataType: 'json',
            data: data,
            contentType: "application/json;charset=utf-8",
            cache: false,
            success: function (result) {
                $('#Save').removeAttr('disabled');
                if (result != null && result != undefined && result != 'null') {
                    var data = JSON.stringify(result);
                    data = $.parseJSON(data);
                    if (data.EmailExists == false)
                        user.CreateUser();
                    else
                        alert('User with same Email id already exists. Please provide a different Email id.');

                }
                else {
                    $('#Save').removeAttr('disabled');
                    console.log(result);
                    alert('Please try again.');
                }
            },
            error: function (xhr, request, status, error) {
                $('#Save').removeAttr('disabled');
                  console.log(xhr);
                alert('Please try again.');
            }
        });

    },

    CreateUser: function () {
        $.support.cors = true;
        var data = '{"UserID": "' + user.UserID + '",' +
                   '"RoleID":"' + user.RoleID + '",' +
                   '"Username":"' + user.Username + '",' +
                   '"Password":"' + user.Password + '",' +
                   '"Email":"' + user.Email + '",' +
                   '"FirstName":"' + user.FirstName + '",' +
                   '"CompanyName":"' + user.CompanyName + '",' +
                   '"Address":"' + user.Address + '",' +
                   '"City":"' + user.City + '",' +
                   '"Zip":"' + user.Zip + '",' +
                   '"State":"' + user.State + '",' +
                   '"Country":"' + user.Country + '",' +
                   '"LanguageID":"' + user.Language + '",' +
                   '"PhoneNo":"' + user.Phoneno + '",' +
                   '"ImageData":"' + user.image + '",' +
                   '"MailSent":"' + user.MailSent + '",' +
                   '"UpdateSubscription":"' + user.UpdateSubscription + '",' +
                   '"CountryCode":"' + user.CountryCode + '",' +
                   '"MemberShipID":"' + user.MemberShipID + '"}';

        var URLFormed = Service.dataServiceURL + Service.ServiceName._UserService + '/' + Service.ServiceMethods._CreateUser;

        $("#LoadingDiv").css({ "position": "absolute", "left": "0px", "top": "0px", 'opacity': '0.8', "z-index": "20002",
            'filter': 'alpha(opacity=40)', "width": "100%", "height": "100%",
            'background-color': 'white'
        });
        $("#Load").css({ "position": "fixed", "z-index": "20003", "top": "50%", "left": "30%" });
        $('#LoadingDiv,#Load').ajaxStart(function () { $('#LoadingDiv,#Load').show(); });
        $('#LoadingDiv,#Load').ajaxComplete(function () { $('#LoadingDiv,#Load').hide(); });

        $.ajax({
            type: "POST",
            url: URLFormed,
            dataType: 'json',
            data: data,
            contentType: "application/json;charset=utf-8",
            cache: false,

            success: function (result) {
                // alert('eee');
                user.UserCreated(result);
            },
            error: function (xhr, request, status, error) {

                $('#Save').removeAttr('disabled');
                alert('Please try again.');
                console.log(xhr);
                //navigator.notification.alert('Please try again.', '', 'Recycle World', 'OK');
            }
        });


    },

    UserCreated: function (result) {
        
        $('#Save').removeAttr('disabled');
        if (result.UserCreated == true || result.UserCreated == 'true') {
            //navigator.notification.alert('User Created Successfully.', '', 'Recycle World', 'OK');
            alert('User Created Successfully.');
            user.Navigate = "true";
        }
        else if (result.UserUpdated == true || result.UserCreated == 'true') {
            // navigator.notification.alert('User Updated Successfully.', '', 'Recycle World', 'OK');

            if (localStorage.SubscriptionPaid != undefined && localStorage.SubscriptionPaid != null) {
                localStorage.User = JSON.stringify(result);
                window.localStorage.removeItem('SubscriptionPaid');

                var d = JSON.stringify(result);
                d = $.parseJSON(d);

                if (d.RoleID == '2') {

                    if (user.MailSent == false) {
                        var message = '';
                        switch (localStorage.Language) {
                            case "1":
                                message = Language.Danish.Join;
                                break;
                            case "2":
                                message = Language.German.Join;
                                break;
                            case "3":
                                message = Language.English.Join;
                                break;
                            case "4":
                                message = Language.Spanish.Join;
                                break;
                        }


                        window.plugins.Sms.sendSMS(function () {

                            user.navigate(result);
                            return;
                        },
		            function (e) {
		                alert('Message Failed:' + e);
		            },
		            d.PhoneNumber,
		            message);

                    }
                    else {
                        user.navigate(result);
                    }
                }
                else {
                    user.navigate(result);
                }
            }
            else {
                localStorage.User = JSON.stringify(result);
                var d = JSON.stringify(result);
                d = $.parseJSON(d);

                if (d.RoleID == '2') {
                    if (user.MailSent == false) {
                        var message = '';
                        switch (localStorage.Language) {
                            case "1":
                                message = Language.Danish.Join;
                                break;
                            case "2":
                                message = Language.German.Join;
                                break;
                            case "3":
                                message = Language.English.Join;
                                break;
                            case "4":
                                message = Language.Spanish.Join;
                                break;
                        }
                        window.plugins.Sms.sendSMS(function () {
                            user.navigate(result);
                        },
                        function (e) {
                            user.navigate(result);
                        },
                            d.PhoneNumber,
                              message);
                    }
                    else {
                        user.navigate(result);
                    }
                }
                else {
                    user.navigate(result);
                }
            }
        }
        else {
            switch (localStorage.Language) {
                case "1":
                    alert(Language.Danish.Ptry);
                    break;
                case "2":
                    alert(Language.German.Ptry);
                    break;
                case "3":
                    alert(Language.English.Ptry);
                    break;
                case "4":
                    alert(Language.Spanish.Ptry);
                    break;
            }
        }
    },


    navigate: function (result) {
        switch (localStorage.Language) {
            case "1":
                alert(Language.Danish.Pupdate);
                break;
            case "2":
                alert(Language.German.Pupdate);
                break;
            case "3":
                alert(Language.English.Pupdate);
                break;
            case "4":
                alert(Language.Spanish.Pupdate);
                break;
        }
        user.Navigate = "true";
        localStorage.User = JSON.stringify(result);
        window.localStorage.removeItem('SubscriptionPaid');
        if (localStorage.CacheItem != undefined && localStorage.CacheItem != '') {
            var Item = $.parseJSON(localStorage.CacheItem);
           app.application.navigate(Item.NavigateURL);
        }
        else
          app.application.navigate('index.html');
    },

    UpdateUser: function () {
        
        if (localStorage.User != null) {
            data = $.parseJSON(localStorage.User);
            user.MemberShipID = data.MemberShipID;
            user.MemberShipType = data.MemberShipType;
            if (data.RoleID == "2") {
                $('#trMemberShip').show();
            }
            else {
                $('#trMemberShip').hide();
            }  

            if (data.Image != "" && data.Image != null) {
                $('#image').attr('src', 'data:image/jpeg;base64,' + data.Image);
                user.image = data.Image;
            }
            else
                $('#image').attr('src', 'images/imageplaceholder.png');

            if (data.UserName != null && data.UserName != 'null' && data.UserName != '') {
                $('#username_fb').val(data.UserName).attr('disabled', 'disabled');
            }
            else {
                $("#username_fb").removeAttr('disabled');
            }
            $("#password_fb").val(data.Password);
            $("#email").val(data.EmailID);
            $("#name").val(data.FirstName);
            $("#companyname").val(data.CompanyName);
            $("#homeadress").val(data.Address);
            $("#homecity").val(data.City);
            $("#zip").val(data.Zip);
            if (data.Country == 'US') {
                $('#dvState').css({ 'display': 'block' });
                if (data.State == null || data.State == "") {
                    $('#state').parent().children('span').find('.ui-btn-text').html('State');
                }
                else {
                    $('#state>option').each(function (i) {

                        if ($(this).val() == data.State) {

                            $('#state').val($(this).val());
                            $('#state').parent().children('span').find('.ui-btn-text').html($(this).html());
                            return;
                        }
                    });                 
                }
                $('#txtState').css({ 'display': 'none' });
            }
            else {
                $('#dvState').css({ 'display': 'none' });
                $('#txtState').css({ 'display': 'block' });
                $("#txtState").val(data.State);
            }

            $("#phoneno").val(data.PhoneNumber);
            user.UserID = data.UserID;
            user.MailSent = data.MailSent;
            if (data.FacebookID != null && data.FacebookID != "") {
                $("#password_fb").css({ "display": "none" });
                $("#username_fb").css({ "display": "none" });
            }
            else {
                // $('#username_fb').attr('disabled', 'disabled');
                $("#password_fb").css({ "display": "block" });
                $("#username_fb").css({ "display": "none" });
            }

            $("#role").val(data.RoleID);
            $("#Languages").val(data.LanguageID);

            if (data.EmailID != "" && data.PhoneNumber != "") {
                user.Navigate = "true";
            }

            if (data.Country == null || data.Country == "") {
                $('#country>option').each(function (i) {
                    if ($(this).val() == '0') {
                        $('#country').val($(this).val());
                        $('#country').parent().children('span').find('.ui-btn-text').html($(this).html());
                        return;
                    }
                });
            }
            else {
                $('#country>option').each(function (i) {
                    if ($(this).val() == data.Country) {
                        $('#country').val($(this).val());
                        $('#country').parent().children('span').find('.ui-btn-text').html($(this).html());
                        return;
                    }
                });              
            }

            $('#role>option').each(function (i) {
                if ($(this).val() == data.RoleID) {
                    $('#role').val($(this).val());
                    $('#role').parent().children('span').find('.ui-btn-text').html($(this).html());
                    return;
                }
            });

            if (data.LanguageID == localStorage.Language) {
                $('#Languages>option').each(function (i) {
                    if ($(this).val() == data.LanguageID) {
                        $('#Languages').val($(this).val());
                        $('#Languages').parent().children('span').find('.ui-btn-text').html($(this).html());
                        return;
                    }
                });
            }
            else {
                $('#Languages>option').each(function (i) {
                    if ($(this).val() == localStorage.Language) {
                        $('#Languages').val($(this).val());
                        $('#Languages').parent().children('span').find('.ui-btn-text').html($(this).html());
                        return;
                    }
                });
            }
          
            $("#username_fb").css({ "display": "none" });
            $('#email').attr('disabled', 'disabled');
        }

    },

    GetMembership: function () {       
        $.support.cors = true;
        var OptionStr = '';
        var URLFormed = Service.dataServiceURL + Service.ServiceName._UserService + '/' + Service.ServiceMethods._GetMemberships;

        $.ajax({
            type: "GET",
            url: URLFormed,
            dataType: 'json',
            data: '',
            cache: false,
            success: function (Result) {
                var data = JSON.stringify(Result);
                data = $.parseJSON(data);
                $.each(data, function (i) {
                    OptionStr += '<option value="' + data[i].ID + '">' + data[i].MemberShipType + '</option>';
                });
                $('#MemberShip').append(OptionStr);
                user.UpdateUser();
            },
            error: function (data) {
                //alert(data);
                return false;
            }
        });
    },

    GetLanguage: function () {       
        $.support.cors = true;
        var OptionStr = '';
        var URLFormed = Service.dataServiceURL + Service.ServiceName._UserService + '/' + Service.ServiceMethods._GetLanguages;

        $.ajax({
            type: "GET",
            url: URLFormed,
            dataType: 'json',
            data: '',
            cache: false,
            success: function (Result) {
                var data = JSON.stringify(Result);
                data = $.parseJSON(data);
                $.each(data, function (i) {
                    OptionStr += '<option value="' + data[i].ID + '">' + data[i].LanguageType + '</option>';
                });
                $('#Languages').append(OptionStr);
                // user.GetMembership();
                user.UpdateUser();
            },
            error: function (data) {
                //alert(data);
                return false;
            }
        });

    },
    GetRoles: function () {       
		if(Roles==undefined) return;
        switch (localStorage.Language) {
            case "1":
                $.each(Roles.Danish, function (i) {
                    $('#role').append('<option value="' + Roles.Danish[i].id + '">' + Roles.Danish[i].Value + '</option>');
                });

                $.each(Languages.Danish, function (i) {
                    $('#Languages').append('<option value="' + Languages.Danish[i].id + '">' + Languages.Danish[i].Value + '</option>');
                });

                break;
            case "2":
                $.each(Roles.German, function (i) {
                    $('#role').append('<option value="' + Roles.German[i].id + '">' + Roles.German[i].Value + '</option>');
                });               

                $.each(Languages.German, function (i) {
                    $('#Languages').append('<option value="' + Languages.German[i].id + '">' + Languages.German[i].Value + '</option>');
                });

                break;
            case "3":
                $.each(Roles.English, function (i) {
                    $('#role').append('<option value="' + Roles.English[i].id + '">' + Roles.English[i].Value + '</option>');
                });
             
                $.each(Languages.English, function (i) {
                    $('#Languages').append('<option value="' + Languages.English[i].id + '">' + Languages.English[i].Value + '</option>');
                });

                break;
            case "4":
                $.each(Roles.Spanish, function (i) {
                    $('#role').append('<option value="' + Roles.Spanish[i].id + '">' + Roles.Spanish[i].Value + '</option>');
                });              

                $.each(Languages.Spanish, function (i) {
                    $('#Languages').append('<option value="' + Languages.Spanish[i].id + '">' + Languages.Spanish[i].Value + '</option>');
                });
                break;
        }


        $('#role>option').each(function (i) {
            if ($(this).val() == '0') {
                $('#role').val($(this).val());
                $('#role').parent().children('span').find('.ui-btn-text').html($(this).html());
                return;
            }
        });
        $('#country>option').each(function (i) {
            if ($(this).val() == '0') {
                $('#country').val($(this).val());
                $('#country').parent().children('span').find('.ui-btn-text').html($(this).html());
                return;
            }
        });
        $('#state>option').each(function (i) {
            if ($(this).val() == '0') {
                $('#state').val($(this).val());
                $('#state').parent().children('span').find('.ui-btn-text').html($(this).html());
                return;
            }
        });
        $('#Languages>option').each(function (i) {
            if ($(this).val() == '0') {
                $('#Languages').val($(this).val());
                $('#Languages').parent().children('span').find('.ui-btn-text').html($(this).html());
                return;
            }
        });
        user.UpdateUser();  
    },


    CreateClick: function () {
        user.blnFlag = true;
        if ($("#role").val() == "0") {
            user.blnFlag = false;
            if (user.Error == '') {
                switch (localStorage.Language) {
                    case "1":
                        user.Error = Language.Danish.Srole;
                        break;
                    case "2":
                        user.Error = Language.German.Srole;
                        break;
                    case "3":
                        user.Error = Language.English.Srole;
                        break;
                    case "4":
                        user.Error = Language.Spanish.Srole;
                        break;
                }

            }
            else {
                switch (localStorage.Language) {
                    case "1":
                        user.Error = user.Error + Language.Danish.Srole;
                        break;
                    case "2":
                        user.Error = user.Error + Language.German.Srole;
                        break;
                    case "3":
                        user.Error = user.Error + Language.English.Srole;
                        break;
                    case "4":
                        user.Error = user.Error + Language.Spanish.Srole;
                        break;
                }
            }
        }
     
        if ($("#name").val() == "") {
            user.blnFlag = false;
            if (user.Error == '') {
                switch (localStorage.Language) {
                    case "1":
                        user.Error = Language.Danish.EnterName;
                        break;
                    case "2":
                        user.Error = Language.German.EnterName;
                        break;
                    case "3":
                        user.Error = Language.English.EnterName;
                        break;
                    case "4":
                        user.Error = Language.Spanish.EnterName;
                        break;
                }
            }
            else {
                switch (localStorage.Language) {
                    case "1":
                        user.Error = user.Error + Language.Danish.EnterName;
                        break;
                    case "2":
                        user.Error = user.Error + Language.German.EnterName;
                        break;
                    case "3":
                        user.Error = user.Error + Language.English.EnterName;
                        break;
                    case "4":
                        user.Error = user.Error + Language.Spanish.EnterName;
                        break;
                }
            }
        }
        if ($("#email").val() == "") {
            user.blnFlag = false;
            if (user.Error == '') {
                switch (localStorage.Language) {
                    case "1":
                        user.Error = Language.Danish.EnterEmail;
                        break;
                    case "2":
                        user.Error = Language.German.EnterEmail;
                        break;
                    case "3":
                        user.Error = Language.English.EnterEmail;
                        break;
                    case "4":
                        user.Error = Language.Spanish.EnterEmail;
                        break;
                }
            }
            else {
                switch (localStorage.Language) {
                    case "1":
                        user.Error = user.Error + Language.Danish.EnterEmail;
                        break;
                    case "2":
                        user.Error = user.Error + Language.German.EnterEmail;
                        break;
                    case "3":
                        user.Error = user.Error + Language.English.EnterEmail;
                        break;
                    case "4":
                        user.Error = user.Error + Language.Spanish.EnterEmail;
                        break;
                }
            }
        }
        else if (!user.validateEmail('email')) {

            user.blnFlag = false;
            if (user.Error == '') {
                switch (localStorage.Language) {
                    case "1":
                        user.Error = Language.Danish.EnterEmailV;
                        break;
                    case "2":
                        user.Error = Language.German.EnterEmailV;
                        break;
                    case "3":
                        user.Error = Language.English.EnterEmailV;
                        break;
                    case "4":
                        user.Error = Language.Spanish.EnterEmailV;
                        break;
                }

            }
            else {
                switch (localStorage.Language) {
                    case "1":
                        user.Error = user.Error + Language.Danish.EnterEmailV;
                        break;
                    case "2":
                        user.Error = user.Error + Language.German.EnterEmailV;
                        break;
                    case "3":
                        user.Error = user.Error + Language.English.EnterEmailV;
                        break;
                    case "4":
                        user.Error = user.Error + Language.Spanish.EnterEmailV;
                        break;
                }
            }
        }

        if ($("#phoneno").val() == "") {
            user.blnFlag = false;
            if (user.Error == '') {
                switch (localStorage.Language) {
                    case "1":
                        user.Error = Language.Danish.Pphone;
                        break;
                    case "2":
                        user.Error = Language.German.Pphone;
                        break;
                    case "3":
                        user.Error = Language.English.Pphone;
                        break;
                    case "4":
                        user.Error = Language.Spanish.Pphone;
                        break;
                }

            }
            else {
                switch (localStorage.Language) {
                    case "1":
                        user.Error = user.Error + Language.Danish.Pphone;
                        break;
                    case "2":
                        user.Error = user.Error + Language.German.Pphone;
                        break;
                    case "3":
                        user.Error = user.Error + Language.English.Pphone;
                        break;
                    case "4":
                        user.Error = user.Error + Language.Spanish.Pphone;
                        break;
                }
            }
        }
       

        if ($("#Languages option:selected").val() == "0") {
            user.blnFlag = false;
            if (user.Error == '') {
                switch (localStorage.Language) {
                    case "1":
                        user.Error = Language.Danish.Planguage;
                        break;
                    case "2":
                        user.Error = Language.German.Planguage;
                        break;
                    case "3":
                        user.Error = Language.English.Planguage;
                        break;
                    case "4":
                        user.Error = Language.Spanish.Planguage;
                        break;
                }
            }
            else {
                switch (localStorage.Language) {
                    case "1":
                        user.Error = user.Error + Language.Danish.Planguage;
                        break;
                    case "2":
                        user.Error = user.Error + Language.German.Planguage;
                        break;
                    case "3":
                        user.Error = user.Error + Language.English.Planguage;
                        break;
                    case "4":
                        user.Error = user.Error + Language.Spanish.Planguage;
                        break;
                }
            }
        }


      

        if ($("#country").val() == "0") {
            user.blnFlag = false;
            if (user.Error == '') {
                user.Error = "Please enter Country.\n";
            }
            else {
                user.Error = user.Error + "Please enter Country.\n";
            }
        }

        if ($("#password").css('display') == 'block') {

            if ($("#password_fb").val() == "") {
                user.blnFlag = false;
                if (user.Error == '') {
                    switch (localStorage.Language) {
                        case "1":
                            user.Error = Language.Danish.PaswordPro;
                            break;
                        case "2":
                            user.Error = Language.German.PaswordPro;
                            break;
                        case "3":
                            user.Error = Language.English.PaswordPro;
                            break;
                        case "4":
                            user.Error = Language.Spanish.PaswordPro;
                            break;
                    }
                }
                else {
                    switch (localStorage.Language) {
                        case "1":
                            user.Error = user.Error + Language.Danish.PaswordPro;
                            break;
                        case "2":
                            user.Error = user.Error + Language.German.PaswordPro;
                            break;
                        case "3":
                            user.Error = user.Error + Language.English.PaswordPro;
                            break;
                        case "4":
                            user.Error = user.Error + Language.Spanish.PaswordPro;
                            break;
                    }
                }
            }            
        }
    },



    validateEmail: function (txtEmail) {
        var a = document.getElementById(txtEmail).value;
        // var filter = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{1,4}$/;
        var filter = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;
        if (filter.test(a)) {
            return true;
        }
        else {
            return false;
        }
    },

    validateNumeric: function (txtNumeric) {
        var data = document.getElementById(txtNumeric).value;

        var numbers = /^(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}(?:\-?|\ ?))[2-9]\d{2}[- ]?\d{4}$/;
        if (data.match(numbers)) {
            return true;
        }
        else {
            return false;
        }
    },

    SendEmailLanguage: function (Name, Email) {
        

        if (user.LanguageMailSent) {
            switch (localStorage.Language) {
                case "1":
                    alert(Language.Danish.EmailSend);
                    break;
                case "2":
                    alert(Language.German.EmailSend);
                    break;
                case "3":
                    alert(Language.English.EmailSend);
                    break;
                case "4":
                    alert(Language.Spanish.EmailSend);
                    break;
            }
            return;
        }

        $.support.cors = true;
        var OptionStr = '';
        var URLFormed = Service.dataServiceURL + Service.ServiceName._UserService + '/' + Service.ServiceMethods._EmailLanguage;

        $.ajax({
            type: "POST",
            url: URLFormed,
            dataType: 'json',
            data: '{"Name":"' + Name + '","EmailID":"' + Email + '"}',
            contentType: "application/json;charset=utf-8",
            cache: false,
            success: function (Result) {
                
                var data = JSON.stringify(Result);
                data = $.parseJSON(data);
                if (data) {
                    //navigator.notification.alert('Email language change request mail sent successfully.', '', 'Recycle World', 'OK');
                    user.LanguageMailSent = true;
                    switch (localStorage.Language) {
                        case "1":
                            alert(Language.Danish.EChange);
                            break;
                        case "2":
                            alert(Language.German.EChange);
                            break;
                        case "3":
                            alert(Language.English.EChange);
                            break;
                        case "4":
                            alert(Language.Spanish.EChange);
                            break;
                    }
                }
                else {
                    // navigator.notification.alert('Error sending email language request mail.', '', 'Recycle World', 'OK');
                    user.LanguageMailSent = false;
                    switch (localStorage.Language) {
                        case "1":
                            alert(Language.Danish.ErrorEmail);
                            break;
                        case "2":
                            alert(Language.German.ErrorEmail);
                            break;
                        case "3":
                            alert(Language.English.ErrorEmail);
                            break;
                        case "4":
                            alert(Language.Spanish.ErrorEmail);
                            break;
                    }
                }

            },
            error: function (data) {
                //alert(data);
                user.LanguageMailSent = false;
                return false;
            }
        });
    },

    SubscriptionPayment: function () {        
        inappbilling.init(user.OnInitSuccess, user.OnInitFailure);
    },

    OnInitSuccess: function (result) {
        switch (localStorage.Language) {
            case "1":
                alert(Language.Danish.Mpayment);
                break;
            case "2":
                alert(Language.German.Mpayment);
                break;
            case "3":
                alert(Language.English.Mpayment);
                break;
            case "4":
                alert(Language.Spanish.Mpayment);
                break;
        }
        inappbilling.purchase(user.OnPaymentSuccess, user.OnPaymentFailure, "android.test.purchased");
    },

    OnInitFailure: function (result) {
        user.RoleID = "1";
        user.MemberShipID = '';
        user.SubscriptionPaid = false;
        alert("Payment Init ERROR: \r\n" + result);
    },

    OnPaymentSuccess: function (result) {
        switch (result) {
            case "android.test.purchased":
                switch (localStorage.Language) {
                    case "1":
                        alert(Language.Danish.Paid);
                        break;
                    case "2":
                        alert(Language.German.Paid);
                        break;
                    case "3":
                        alert(Language.English.Paid);
                        break;
                    case "4":
                        alert(Language.Spanish.Paid);
                        break;
                }
                user.SubscriptionPaid = true;
                user.MemberShipID = '1';
                localStorage.SubscriptionPaid = "Paid_" + user.MemberShipID + "_" + user.RoleID;
                user.CreateUser();
                break;
            case "CANCELLED" || "cancelled":
                switch (localStorage.Language) {
                    case "1":
                        alert(Language.Danish.Pcancel);
                        break;
                    case "2":
                        alert(Language.German.Pcancel);
                        break;
                    case "3":
                        alert(Language.English.Pcancel);
                        break;
                    case "4":
                        alert(Language.Spanish.Pcancel);
                        break;
                }
                user.RoleID = "1";
                user.MemberShipID = '';
                user.SubscriptionPaid = false;
                break;
            case "REFUNDED" || "refunded":
                switch (localStorage.Language) {
                    case "1":
                        alert(Language.Danish.Prefund);
                        break;
                    case "2":
                        alert(Language.German.Prefund);
                        break;
                    case "3":
                        alert(Language.English.Prefund);
                        break;
                    case "4":
                        alert(Language.Spanish.Prefund);
                        break;
                }
                user.RoleID = "1";
                user.MemberShipID = '';
                user.SubscriptionPaid = false;
                break;
            case "EXPIRED" || "expired":
                switch (localStorage.Language) {
                    case "1":
                        alert(Language.Danish.Pexpire);
                        break;
                    case "2":
                        alert(Language.German.Pexpire);
                        break;
                    case "3":
                        alert(Language.English.Pexpire);
                        break;
                    case "4":
                        alert(Language.Spanish.Pexpire);
                        break;
                }
                user.RoleID = "1";
                user.MemberShipID = '';
                user.SubscriptionPaid = false;
                break;
        }
    },

    OnPaymentFailure: function (result) {
        user.RoleID = "1";
        user.MemberShipID = '';
        user.SubscriptionPaid = false;
        switch (localStorage.Language) {
            case "1":
                alert(Language.Danish.Ptry);
                break;
            case "2":
                alert(Language.German.Ptry);
                break;
            case "3":
                alert(Language.English.Ptry);
                break;
            case "4":
                alert(Language.Spanish.Ptry);
                break;
        }
    }
};

$(document).ready(function () {
    changeLanguage(localStorage.LanguageType);
    var opts = { language: localStorage.LanguageType, pathPrefix: "Scripts/Resources" };
    $("[data-localize]").localize("Recycle", opts);
    if (localStorage.SubscriptionPaid != undefined && localStorage.SubscriptionPaid != null) {
        var array = localStorage.SubscriptionPaid.split('_');
        User = $.parseJSON(localStorage.User);
        user.UserID = User.UserID;
        if (array[2] == '1')
            user.RoleID = '1';
        else
            user.RoleID = '2';
        user.Username = User.UserName;
        user.Password = User.Password;
        user.Email = User.EmailID;
        user.FirstName = User.FirstName;
        user.CompanyName = User.CompanyName;
        user.Address = User.Address;
        user.City = User.City;
        user.Zip = User.Zip;
        user.State = User.State;
        user.Country = User.Country;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $.getJSON('http://ws.geonames.org/countryCode', {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    type: 'JSON',
                    async: false
                }, function (result) {
                    user.CountryCode = result.countryCode;
                });
            });
        }
        else {
            user.CountryCode = user.Country;
        }
        user.Language = User.LanguageID;
        user.Phoneno = User.PhoneNumber;
        user.image = User.Image;
        user.MailSent = User.MailSent;
        user.UpdateSubscription = true;
        user.MemberShipID = array[1];
        alert(user.MemberShipID + ', ' + user.UpdateSubscription);
        user.CreateUser();
    }
    user.LanguageMailSent = false;
    user.GetRoles();
    $("#saveuser").click(function () {
        var data = $.parseJSON(localStorage.User);
        if (data.RoleID == "3") {
            var message = '';
            switch (localStorage.Language) {
                case "1":
                    message = Language.Danish.Register;
                    break;
                case "2":
                    message = Language.German.Register;
                    break;
                case "3":
                    message = Language.English.Register;
                    break;
                case "4":
                    message = Language.Spanish.Register;
                    break;
            }
            if (confirm(message)) {
                localStorage.User = null;
                app.application.navigate("signup_login.html");
                return;
            }
            else {
                return;
            }
        }
        user.CreateClick();
        if (user.blnFlag) {
            if ($('#Save').attr('disabled') == 'disabled')
                return;
            else
                $('#Save').attr('disabled', 'disabled');
            if (user.UserID == null || user.UserID == "") {
                user.UserID = '0';
            }
            user.RoleID = $("#role option:selected").val();
            user.Username = $("#username_fb").val();
            user.Password = $("#password_fb").val();
            user.Email = $("#email").val();
            user.FirstName = $("#name").val();
            user.CompanyName = $("#companyname").val();
            user.Address = $("#homeadress").val();
            user.City = $("#homecity").val();
            user.Zip = $("#zip").val();
            // user.Country = $("#country").val();
            user.Country = $('#country').val();
            if ((user.CountryCode == '' || user.CountryCode == null) && (user.Country == '' || user.Country == null || user.Country == '0' || user.Country == 0)) {
               
            }
            else {
                user.CountryCode = user.Country;
            }

            if (user.Country == 'US') {
                user.State = $('#state').val();
            }
            else {
                user.State = $("#txtState").val();
            }

            user.Phoneno = $("#phoneno").val();
            
            if ($("#Languages option:selected").val() == null || $("#Languages option:selected").val() == "" || $("#Languages option:selected").val() == '0') {
                user.Language = localStorage.Language;
            }
            else {
                user.Language = $("#Languages option:selected").val();

                // user.Language = $('#Languages').parent().children('span').find('.ui-btn-text').html();
                localStorage.Language = user.Language;

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
                }
            }
            
            if (user.RoleID == "2") {
                $('#Save').removeAttr('disabled');
                if (user.MemberShipID == 'null' || user.MemberShipID == '' || user.MemberShipID == null) {
                    
                    //var Plan = $('#MemberShip').parent().children('span').find('.ui-btn-text').html();
                    var Plan = $('#Plan').text();
                    var message = '';
                    switch (localStorage.Language) {
                        case "1":
                            message = Language.Danish.SupporterYes;
                            break;
                        case "2":
                            message = Language.German.SupporterYes;
                            break;
                        case "3":
                            message = Language.English.SupporterYes;
                            break;
                        case "4":
                            message = Language.Spanish.SupporterYes;
                            break;
                    }

                    if (confirm(message)) {
                        user.UpdateSubscription = true;
                        if (user.SubscriptionPaid) {                         
                            user.CreateUser();
                        }
                        else {                           
                            user.SubscriptionPayment();
                        }
                    }
                    else {
                        return;
                    }
                }
                else {   
                    user.UpdateSubscription = false;
                     user.CreateUser();
                 
                }
            }
            else {              

                if (user.MemberShipID != 'null' && user.MemberShipID != '' && user.MemberShipID != null) {
                    $('#Save').removeAttr('disabled');
                    var message = '';
                    switch (localStorage.Language) {
                        case "1":
                            message = Language.Danish.ChangeMember;
                            break;
                        case "2":
                            message = Language.German.ChangeMember;
                            break;
                        case "3":
                            message = Language.English.ChangeMember;
                            break;
                        case "4":
                            message = Language.Spanish.ChangeMember;
                            break;
                    }

                    if (confirm(message)) {
                        user.UpdateSubscription = false;
                        user.MemberShipID = '';
                        user.CreateUser();
                    }
                    else {
                        return;
                    }
                }
                else {
                    user.UpdateSubscription = false;
                    user.CreateUser();
                }
            }
        }
        else {            
            alert(user.Error);
            user.Error = '';            
        }
    });

    $('#country').change(function () {
        if ($(this).val() == 'US') {
            $('#dvState').css({ 'display': 'block' });
            $('#txtState').css({ 'display': 'none' });
            $('#state').parent().children('span').find('.ui-btn-text').html('State');
        }
        else {
            $('#dvState').css({ 'display': 'none' });
            $('#txtState').css({ 'display': 'block' });
        }
    });


    $('#EmailLanguage').click(function () {
        var blnFlag = true;
        var Error = '';
        if ($("#name").val() == "") {
            blnFlag = false;
            if (user.Error == '') {
                switch (localStorage.Language) {
                    case "1":
                        Error = Language.Danish.EnterName;
                        break;
                    case "2":
                        Error = Language.German.EnterName;
                        break;
                    case "3":
                        Error = Language.English.EnterName;
                        break;
                    case "4":
                        Error = Language.Spanish.EnterName;
                        break;
                }
            }
            else {
                switch (localStorage.Language) {
                    case "1":
                        Error = Error + Language.Danish.EnterName;
                        break;
                    case "2":
                        Error = Error + Language.German.EnterName;
                        break;
                    case "3":
                        Error = Error + Language.English.EnterName;
                        break;
                    case "4":
                        Error = Error + Language.Spanish.EnterName;
                        break;
                }
            }
        }
        if ($("#email").val() == "") {
            blnFlag = false;
            if (user.Error == '') {
                switch (localStorage.Language) {
                    case "1":
                        Error = Language.Danish.EnterEmail;
                        break;
                    case "2":
                        Error = Language.German.EnterEmail;
                        break;
                    case "3":
                        Error = Language.English.EnterEmail;
                        break;
                    case "4":
                        Error = Language.Spanish.EnterEmail;
                        break;
                }
            }
            else {
                switch (localStorage.Language) {
                    case "1":
                        Error = Error + Language.Danish.EnterEmail;
                        break;
                    case "2":
                        Error = Error + Language.German.EnterEmail;
                        break;
                    case "3":
                        Error = Error + Language.English.EnterEmail;
                        break;
                    case "4":
                        Error = Error + Language.Spanish.EnterEmail;
                        break;
                }
            }
        }
        else if (!user.validateEmail('email')) {

            blnFlag = false;
            if (user.Error == '') {
                switch (localStorage.Language) {
                    case "1":
                        Error = Language.Danish.EnterEmailV;
                        break;
                    case "2":
                        Error = Language.German.EnterEmailV;
                        break;
                    case "3":
                        Error = Language.English.EnterEmailV;
                        break;
                    case "4":
                        Error = Language.Spanish.EnterEmailV;
                        break;
                }
            }
            else {
                switch (localStorage.Language) {
                    case "1":
                        Error = Error + Language.Danish.EnterEmailV;
                        break;
                    case "2":
                        Error = Error + Language.German.EnterEmailV;
                        break;
                    case "3":
                        Error = Error + Language.English.EnterEmailV;
                        break;
                    case "4":
                        Error = Error + Language.Spanish.EnterEmailV;
                        break;
                }
            }
        }

        if (blnFlag) {
            user.SendEmailLanguage($("#name").val(), $("#email").val());
        }
        else {
            // navigator.notification.alert(Error, '', 'Recycle World', 'OK');
            alert(Error);
        }
    });

    $('#role').change(function () {

        if ($('#role option:selected').val() == '2') {
            $('#trMemberShip').show();          
        }
        else {
            $('#trMemberShip').hide();
        }
    });

   /* $('#actDiff').click(function () {
      app.application.navigate("account_differences.html");
    });*/
});  
