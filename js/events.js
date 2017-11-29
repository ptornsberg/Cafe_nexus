$(document).ready(() => {

    SDK.User.loadNav();

    const $eventsList = $("#events-list");
    const $eventList = $("#event-list");
    const $postList = $("#post-list");
    const $commentList = $("#comment-list");

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
     <div class="<col>-lg-10">
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
<div class="col-lg-10 col-lg-push-1 jumbotron">

    <tr>
        <dt>Post</dt>
        <dd>${post.content}</dd>
        <dt>Post created</dt>
        <dd>${post.created}</dd>
        <dt>By</dt>
        <dd>${post.owner.id}</dd>
        <dt>Comments</dt>
        <dd><button class="btn btn-default showCommentsBtn" data-post-id="${post.id}">Show</button></dd>
        </tr> 
       
</div>

           


            `;
                    $postList.append(eventPostsHtml);
                });

                $(".showCommentsBtn").click(function () {
                    $("#comments-modal").modal("toggle");

                    const postId = $(this).data("post-id");

                    SDK.Storage.persist("postId", postId);

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
            $("#event").toggle(1000);
            $("#events").toggle(1000);
            window.location.href = "events.html";
        });

        $("#addPostBtn").click(() => {
            const content = $("#inputAddPost").val();
            const owner = SDK.Storage.load("userId");
            const event = SDK.Storage.load("eventId");


            SDK.Posts.create(owner, content, event, (err) => {
                window.alert("Post created");
                window.location.href = "events.html";


            });
        });

        $("#addCommentBtn").click(() => {

            const owner = SDK.Storage.load("userId");
            const content = $("#inputComment").val();
            const parent = SDK.Storage.load("postId");


            SDK.Posts.createComment(owner, content, parent, (err) => {
                window.alert("Comment created");
            });
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

        $("#comments-modal").on("shown.bs.modal", () => {
            SDK.Posts.findComments((err, comments) => {
                comments.comments.forEach((comment) => {

                    const $modalTbody = $("#modal-tbody");
                    $modalTbody.append(`
    <dl>
        <dt>Comments</dt>
        <dl>${comment.content}</dl>
        <dt>Comment created</dt>
        <dl>${comment.created}</dl>
        <dt>By user</dt>
        <dl>${comment.owner.id}</dt>
    </dl> 
        `);
                });
            });
        });
    });

    $("comments-modal").on("hidden.bs.modal", function () {
        $("#modal-tbody").html("");
    });

});
