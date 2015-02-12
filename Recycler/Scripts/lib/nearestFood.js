function nearestFoodInit() {
    // get current loction 
    window.getLocation()
         .done(function (position) {
             var query = new Everlive.Query();
             //query.where().nearSphere('Location', [position.coords.latitude, position.coords.longitude], 20, 'km');
             query.where().nearSphere('Location', [43.465187, -80.52237200000002], 20, 'km');
             query.take(10);
             var data = app.everlive.data('Spot');
             data.get(query)
                 .then(function (data) {
                     var spots = data.result;
                     //Get the external template definition using a jQuery selector
                     var template = kendo.template($('#spotNearestTableTemplate').html());

                     var result = template(spots); //Execute the template

                     $('#spotNearestTable').html(result); //Append the result
                     $('#spotNearestTable').css({ 'width': '100%' });
                 },
                 function (error) {
                     alert(JSON.stringify(error));
                 });
         })
         .fail(function (error) {
             alert(error.message); /*TODO: Better handling*/
         });
}

function onSpotInfoClick(id) {
    var data = app.everlive.data('Spot');
    var query = new Everlive.Query();
    query.where().eq('Id', id).done();
    data.get(query).then(function (data) {
        app.currentNearestSpot = data.result[0];
        app.application.navigate('nearestSpotInfo.html');

        hideLoading();

    },
         function (error) {
             alert(JSON.stringify(error));
         });
}

function fillNearestSpotInfoContent() {
    if (app.currentNearestSpot) {
        var spot = app.currentNearestSpot;
        var content =
            "<div class='table-container' ><table>" +
                "<tr><td></td><td class='spotName'>" + spot.Name + "</td></tr>" +
                "<tr><td></td><td class='spotDate'>" + spot.EventDate + "</td></tr>" +
                "<tr class='img'><td></td><td> <img class='popupImg' src='" + spot.Image + "' /></td></tr>" +
                "<tr> <td><img class='td-icon' src='images/mapicons/info_blue.png' /></td><td> " + spot.Description + "</td></tr>" +
                "<tr><td><img class='td-icon' src='images/mapicons/phone_blue.png' /></td><td> " + spot.Phone + "</div>" +
                "<tr> <td><img class='td-icon' src='images/mapicons/opening_blue.png' /></td><td> Weekdays: " + spot.OpeningHoursWeekdaysFrom + " " + spot.OpeningTimeWeekdays + " - " +
                spot.OpeningHoursWeekdaysTo + " " + spot.ClosingTimeWeekdays + "</td></tr>" +
                "<tr><td></td><td> Saturday: " + spot.OpeningHoursSaturdayFrom + " " + spot.OpeningTimeSat + " - " +
                spot.OpeningHoursSaturdayTo + " " + spot.ClosingTimeSat + "</td></tr>" +
                "<tr><td></td><td> Sunday: " + spot.OpeningHoursSundayFrom + " " + spot.OpeningTimeSun + " - " +
                spot.OpeningHoursSundayTo + " " + spot.ClosingTimeSun + "</td></tr>" +
                "<tr><td><img class='td-icon' src='images/mapicons/adress_blue.png' /></td><td>  " + spot.Address + "</td></tr>" +
                "<tr><td></td><td>  " + spot.City + "</td></tr>" +
                "<tr><td></td><td>" + spot.Zip + "</td></tr>" +
                "<tr><td><img class='td-icon' src='images/mapicons/www_icon_blue.png' /></td><td> <a href='" + spot.Web + "'>" + spot.Web + "</a></td></tr>" +
                "</table></div>";
        $(".spot-info-content").html(content);
    }
}

var nearestPlacesIdChecked= [];
function onSendMessagesChecked(cb, id)
{
    if(cb.checked)
    {
        nearestPlacesIdChecked.push(id);
    }
    else{
        //var index = nearestPlacesIdChecked.indexOf(id);
        nearestPlacesIdChecked.remove(id)        
    }
}

function sendEmailForCheckedPlaces()
{
    if(nearestPlacesIdChecked.length>0)
    {
        showLoading();
          var data = app.everlive.data('Users');                              
         var  query = new Everlive.Query(); 
        query.where().isin('Id', nearestPlacesIdChecked);
    data.get(query).then(function (data) {
   debugger;
        if(data.result.length>0)
        {
            var emailList = [];
            data.result.forEach(function(user) {
 emailList.push(user.Email);
        sendMail("fooddonation_email",emailList,{"userName":User.DisplayName,  "appName":emailTemplates.DefaultFromName,"DefaultFromName":emailTemplates.DefaultFromName ,"userName":User.DisplayName, "FromEmail":emailTemplates.FromEmail});
                
})
        }
       

        hideLoading();

    },
         function (error) {
         hideLoading();
             alert(JSON.stringify(error));
         });
    }
}



Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};