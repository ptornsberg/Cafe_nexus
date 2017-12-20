$(document).ready(function () {
    //Show and hide buttons for different div's in the login.html page.
    $("#showSignUpBtn").click(function () {
        $("#signUp").toggle(1000);
        $("#login").hide(1000);
    });
    $("#showLoginBtn").click(function () {
        $("#signUp").hide(1000);
        $("#login").toggle(1000);
    });

    //Sendes the email and password to validation on the server-
    $("#loginBtn").click(() => {
        const email = $("#inputEmail").val();
        const password = $("#inputPassword").val();

        SDK.User.login(password, email, (err, data) => {

            if (err && err.xhr.status === 401) {
                $(".form-group").addClass("has-error");
                window.alert("Email or password is wrong, try again");
            }
            else if (err) {
                $(".form-group").addClass("has-error");
                window.alert("Something went wrong, try again")
            } else {
                window.location.href = "home.html";
                window.alert("You are now logged in");
                SDK.User.findAll((err, users) => {
                    SDK.Storage.persist("users", users);
                });
            };
        });

    });

    /Creates a new user.
    $("#signUpBtn").click(() => {

        const firstName = $("#inputFirstName").val();
        const lastName = $("#inputLastName").val();
        const password = $("#signUpPassword").val();
        const email = $("#signUpEmail").val();
        const description = $("#inputDescription").val();
        const gender = $("#inputGender").val();
        const major = $("#inputMajor").val();
        const semester = $("#inputSemester").val();

        SDK.User.create(password, firstName, lastName, email, description, gender, major, semester, (err, data) => {
            consule.log(err, data);
        });
        window.alert("User created");
        window.location.href = "login.html";


    });
});