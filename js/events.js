$(document).ready(() => {

    SDK.User.loadNav();

    const $eventList = $("#event-list");

    SDK.Events.findAll((err, events) => {
        events.forEach((event) => {

            const eventHtml = `
<div class="col-lg-12" id="eventTable">
    <table class="table">
              
        <tr>
            <td>${event.title}</td>
            <td>${event.description}</td>
            <td>${event.startDate}</td>
            <td>${event.endDate}</td>
           <td><button class="btn btn-default showEventBtn" data-event-id="${event.id}">Show</button></td>            
        </tr>
            
    </table>
    
</div>
            `;
            $eventList.append(eventHtml);
        });
        $(".showEventBtn").click(function () {
            const eventId = $(this).data("event-id");
            const event = events.find((event) => event.id == eventId);
            window.alert(eventId);
        });
    });

    $("#showCreateEventBtn").click(function () {
        $("#events").hide(1000);
        $("#createEvent").toggle(1000);
    });

    $("#showEventsBtn").click(() => {
        $("#createEvent").hide(1000);
        $("#events").toggle(1000);
    });

    $("#showAllEventsBtn").click(() => {
        $("#events").hide(1000);
        $("#showEvent").toggle(1000);
    });
    $("#createEventBtn").click(() => {

        const owner_id = 3;
        const title = $("#inputTitle").val();
        const startDate = $("#inputStartDate").val();
        const endDate = $("#inputEndDate").val();
        const description = $("#inputEventDescription").val();

        SDK.Events.createEvent(owner_id, title, startDate, endDate, description, (err) => {
            consule.log(err);
        });
        window.alert("Event created");
    });

});