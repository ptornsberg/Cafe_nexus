$(document).ready(() => {

    SDK.User.loadNav();

    const $userList = ("#user-list");

    SDK.User.findAll((err, users) => {
        users.forEach((user) => {

            $userList.append(`
<div class="co-lg-12">
    <table class="table">
        <tr>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.gender}</td>
            <td>${user.description}</td>
            <td>${user.major}</td>
            <td>${user.semester}</td>
           </tr>
    </table>
</div>
            `);
        });
    });
});