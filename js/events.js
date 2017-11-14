$(document).ready(() => {

    SDK.User.loadNav();

    $("#showCreateEventBtn").click(function(){
        $("#events").hide(1000);
        $("#createEvent").toggle(1000);
    });
});
    $("#showEventsBtn").click(() => {
        $("#createEvent").hide(1000);
        $("#events").toggle(1000);
});
$("#createEventBtn").click(() => {

    const title = $("#inputTitle").val();
    const startDate = $("#inputStartDate").val();
    const endDate = $("#inputEndDate").val();
    const description = $("#inputEventDescription").val();

    SDK.event.create(title, startDate, endDate, description, (err) => {

        window.alert("Event created");
        window.location.href = "events.html";
    });

});