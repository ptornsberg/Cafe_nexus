$(document).ready(() => {
    //Get the navigation bar
    SDK.User.loadNav();

    //Creates a constant for the userList in users.html.
    const $userList = $("#user-list");

    //Server call to get all users.
    SDK.User.findAll((err, users) => {

        //The forEach loop, will get all users and fill into the userList.
        //Reference: line 13 - 33 is inspired from DIS Bookstore 2017
        //which was used as an example in class.
        users.forEach((user) => {

            $userList.append(`
<div class="col-lg-12">
    <table class="table">
              
        <tr>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.gender}</td>
            <td>${user.major}</td>
            <td>${user.semester}</td>
            <td>${user.description}</td>
        </tr>
    </table>
</div>
            `);
        });
    });
});