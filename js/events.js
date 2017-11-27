$(document).ready(() => {

    SDK.User.loadNav();

    const $eventsList = $("#events-list");
    const $eventList = $("#event-list");
    const $postList = $("#post-list");

    SDK.Events.findAll((err, events) => {
        events.forEach((event) => {

            const eventsHtml = `
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
            $eventsList.append(eventsHtml);
        });
        $(".showEventBtn").click(function () {
            const eventId = $(this).data("event-id");
            const event = events.find((event) => event.id == eventId);

            SDK.Storage.persist("eventId", eventId);
            SDK.Events.findEvent((err, event) => {

                console.log(event);

                let eventHtml = `
<div class="col-lg-12" id="eventTable">
    <table class="table">
  
        <tr>
            <td>${event.title}</td>
            <td>${event.description}</td>
            <td>${event.startDate}</td>
            <td>${event.endDate}</td>          
        </tr>
            
    </table>
     <div class="col-lg-10">
        <dl>
            <dt>Created</dt>
            <dd>${event.created}</dd>
            <dt>By</dt>
            <dd>${event.owner.id}</dd>         
        </dl>       
    </div>
    
</div>
            `;
                $eventList.append(eventHtml);


            });

            SDK.Events.findEvent((err, event) => {
                event.posts.forEach((post) => {
                    console.log(post);

                    const eventPostsHtml = `
<div class="col-lg-8 col-lg-push-1">

    <tr>
        <H3>Post</H3>
        <H2>${post.content}</H2>
        <dt>Post created</dt>
        <dd>${post.created}</dd>
        <dt>By</dt>
        <dd>${post.owner.id}</dd>
        </tr> 

</div>

            `;
                    $postList.append(eventPostsHtml);
                });

            });
            $("#events").hide(1000);
            $("#event").toggle(1000);


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
        $("#event-list div").remove();
        $("#event").hide(1000);
        $("#events").toggle(1000);
    });

    $("#addPostBtn").click(() => {
        const content = $("#inputAddPost").val();
        const owner = SDK.Storage.load("userId");
        const event = SDK.Storage.load("eventId");


        SDK.Posts.create( owner, content, event, (err) => {
            window.alert("Post created");
        });

        $("#createEventBtn").click(() => {

            const owner_id = SDK.Storage.load("userId");
            const title = $("#inputTitle").val();
            const startDate = $("#inputStartDate").val();
            const endDate = $("#inputEndDate").val();
            const description = $("#inputEventDescription").val();

            SDK.Events.createEvent(owner_id, title, startDate, endDate, description, (err) => {
            });
            window.alert("Event created");
            window.location.href = "events.html";
        });

    });

});
