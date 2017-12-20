$(document).ready(() => {
    //Get the navigation bar.
    SDK.User.loadNav();

    //Creating constants for the events.html page.
    const $eventsList = $("#events-list");
    const $eventList = $("#event-list");
    const $postList = $("#post-list");
    const $commentList = $("#comment-list");

    //Finds all events by a foreach loop and presents it
    // in a list.
    SDK.Events.findAll((err, events) => {
        events.forEach((event) => {

    //Describes what will be presented for each event.
            const eventsHtml = `
<div class="col-lg-12" id="eventTable">
    <table class="table">
              
        <tr>
            <td>${event.title}</td>
            <td>${event.description}</td>
            <td>${event.startDate}</td>
            <td>${event.endDate}</td>
            <td>${(SDK.Storage.load("users"))[(event.owner.id)-1].firstName} ${(SDK.Storage.load("users"))[(event.owner.id)-1].lastName}</td>
           <td><button class="btn btn-default showEventBtn" data-event-id="${event.id}">Show</button></td>            
        </tr>
            
    </table>
    
</div>
            `;
            //The eventHtml is appended into the eventList and put into
            //the events.html.
            $eventsList.append(eventsHtml);
        });

        //When pressing "show" on an event, it takes the eventId and saves in local storage and finds the specific event.
        $(".showEventBtn").click(function () {
            const eventId = $(this).data("event-id");
            const event = events.find((event) => event.id == eventId);

            //Saves eventId for specific event in local storage.
            SDK.Storage.persist("eventId", eventId);
            SDK.Events.findEvent((err, event) => {

                console.log(event);

//Describes what will be presented for the specific event.
                let eventHtml = `
<div class="col-lg-12" id="eventTable">
    <table class="table">
  
        <tr>
            <td>${event.title}</td>
            <td>${event.description}</td>
            <td>${event.startDate}</td>
            <td>${event.endDate}</td>  
            <td>${event.created}</td>  
            <td>${(SDK.Storage.load("users"))[(event.owner.id)-1].firstName} ${(SDK.Storage.load("users"))[(event.owner.id)-1].lastName}</td> 
            <td>${event.posts.length}</td>      
        </tr>
            
    </table>
    
</div>
            `;
                $eventList.append(eventHtml);

            });
            //After presenting the specific event, all the posts on this event will be presented.
            SDK.Events.findEvent((err, event) => {
                event.posts.forEach((post) => {
                    console.log(post);

//This describes what each post will consist of and presented as such.
                    const eventPostsHtml = `
<div class="col-lg-10 col-lg-push-1 jumbotron">

    <tr>
        <H3 style="color:lightseagreen;">${post.content}</H3>
        <dt>Post created</dt>
        <dd>${post.created}</dd>  
        <dt>By</dt>
        <dd>${(SDK.Storage.load("users"))[(post.owner.id)-1].firstName} ${(SDK.Storage.load("users"))[(post.owner.id)-1].lastName}</dd>
        <dt style="color:lightseagreen;">Comments</dt>
        <dd><button class="btn btn-default showCommentsBtn" data-post-id="${post.id}">Show</button></dd>
        </tr> 
       
</div>

           


            `;
                    $postList.append(eventPostsHtml);
                });

                //This will fire when the "show" button is clicked and will toggle the comment-modal and save the postId in local storage.
                $(".showCommentsBtn").unbind().click(function () {
                    $("#modal-tbody").html("");
                    $("#comments-modal").modal("toggle");

                    const postId = $(this).data("post-id");

                    SDK.Storage.persist("postId", postId);

                });

                $("#events").hide(1000);
                $("#event").toggle(1000);


            });

        });

        //These button-functions are effects to show and hide different div's in the events.html page.
        $("#showCreateEventBtn").click(function () {
            $("#events").hide(1000);
            $("#createEvent").toggle(1000);
        });

        $("#showEventsBtn").click(() => {
            $("#createEvent").hide(1000);
            $("#events").toggle(1000);
        });

        $("#showAllEventsBtn").click(() => {
            $("#event").toggle(1000);
            $("#events").toggle(1000);
            window.location.href = "events.html";
        });
        //Adds a post to a specific event.
        $("#addPostBtn").click(() => {
            const content = $("#inputAddPost").val();
            const owner = SDK.Storage.load("userId");
            const event = SDK.Storage.load("eventId");


            SDK.Posts.create(owner, content, event, (err) => {
                window.alert("Post created");
                window.location.href = "events.html";


            });
        });
        //Adds a comment to a specific post.
        $("#addCommentBtn").click(() => {

            const owner = SDK.Storage.load("userId");
            const content = $("#inputComment").val();
            const parent = SDK.Storage.load("postId");


            SDK.Posts.createComment(owner, content, parent, (err) => {
                $("#comments-modal").modal("toggle");
               window.alert("Comment created");
            });
        });

        //Creates an event
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

        //Opens up a modal, with all the specific comments to a specific post.
        $("#comments-modal").on("shown.bs.modal", () => {
            SDK.Posts.findComments((err, comments) => {
                comments.comments.forEach((comment) => {

                    const $modalTbody = $("#modal-tbody");
                    $modalTbody.append(`
    <dl>
        <H3 style="color:lightseagreen;">${comment.content}</H3>
        <dt>Comment created</dt>
        <dl>${comment.created}</dl>
        <dt>By</dt>
        <dl>${(SDK.Storage.load("users"))[(comment.owner.id)-1].firstName} ${(SDK.Storage.load("users"))[(comment.owner.id)-1].lastName}</dt>
    </dl> 
        `);
                });
            });
        });
    });

});
