//Creating a constant of SDK, it is possible to call methods from ofter .js pages.
const SDK = {

    //Initializing the serverURL.
    //Reference: line 6 - 31 is copied from DIS Bookstore 2017
    //which was used as an example in class.
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        let headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: headers,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                cb(null, data, status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
            }
        });
    },

    //All server calls on posts: findAll, findComments, create and createComments.
    Posts: {
        findAll: (cb) => {
            SDK.request({
                method: "GET",
                url: "/posts",
                headers: {authorization: "Bearer " + SDK.Storage.load("token")}
            }, cb);
        },

        findComments: (cb) => {
            SDK.request({
                method: "GET",
                url: "/posts/" + SDK.Storage.load("postId"),
                headers: {authorization: "Bearer " + SDK.Storage.load("token")}
            }, cb);
        },


        create: (owner, content, event, cb) => {
            SDK.request({
                method: "POST",
                url: "/posts",
                data: {
                    owner: owner,
                    content: content,
                    event: event
                },
                headers: {authorization: "Bearer " + SDK.Storage.load("token")}
            }, cb);
        },
        createComment: (owner, content, parent, cb) => {
            SDK.request({
                method: "POST",
                url: "/posts",
                data: {
                    owner: owner,
                    content: content,
                    parent: parent
                },
                headers: {authorization: "Bearer " + SDK.Storage.load("token")}
            }, cb);
        },
    },

    //All server calls on events: createEvent, findAll and findEvent.
    Events: {
        createEvent: (owner_id, title, startDate, endDate, description, cb) => {
            SDK.request({
                method: "POST",
                url: "/events",
                data: {
                    owner_id: owner_id,
                    title: title,
                    startDate: startDate,
                    endDate: endDate,
                    description: description
                },
                headers: {authorization: "Bearer " + SDK.Storage.load("token")},
            }, cb);
        },
        findAll: (cb) => {
            SDK.request({
                method: "GET",
                url: "/events",
                headers: {authorization: "Bearer " + SDK.Storage.load("token")}
            }, cb);
        },
        findEvent: (cb) => {
            SDK.request({
                url: "/events/" +SDK.Storage.load("eventId"),
                method: "GET",
                headers: {authorization: "Bearer " + SDK.Storage.load("token")}
            }, cb);
        },
    },

    //All server calls on User: findAll, create, current, logout, login and loadNav.
    User: {
        findAll: (cb) => {
            SDK.request({
                url: "/users",
                method: "GET",
                headers: {authorization: "Bearer " + SDK.Storage.load("token")}
            }, cb);
        },

        create: (password, firstName, lastName, email, description, gender, major, semester, cb) => {
            SDK.request({
                data: {
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    description: description,
                    gender: gender,
                    major: major,
                    semester: semester
                },
                method: "POST",
                url: "/users"
            }, cb)
        },
        current: () => {
            return SDK.Storage.load("userId");
        },

        //Removes all from local storage when logging out and returns to login page.
        logOut: () => {
            SDK.Storage.remove("token");
            SDK.Storage.remove("userId");
            SDK.Storage.remove("eventId");
            SDK.Storage.remove("postId");
            SDK.Storage.remove("users");
            window.location.href = "login.html";
        },
        login: (password, email, cb) => {
            SDK.request({
                data: {
                    password: password,
                    email: email
                },
                url: "/auth",
                method: "POST"
            }, (err, data) => {

                //On login-error
                if (err) return cb(err);

                //Decodes Token, to get out the userId, to be stored in local storage.
                //Reference: line 162 - 169 https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript
                let token = data;

                var base64Url = token.split('.')[0];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                console.log(JSON.parse(window.atob(base64)));

                SDK.Storage.persist("userId", JSON.parse(window.atob(base64)).kid);
                SDK.Storage.persist("token", data);

                cb(null, data);

            });
        },


        //Reference: line 180 - 215 is copied from DIS Bookstore 2017
        //which was used as an example in class.
        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {
                const currentUser = SDK.User.current();
                if (currentUser) {
                    $(".navbar-right").html(`
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
                } else {
                    $(".navbar-right").html(`
            <li><a href="login.html">Log-in <span class="sr-only">(current)</span></a></li>
          `);
                }
                $("#logout-link").click(() => SDK.User.logOut());
                cb && cb();
            });
        }
    },
    Storage: {
        prefix: "CafeNexusSDK",
        persist: (key, value) => {
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },
        load: (key) => {
            const val = window.localStorage.getItem(SDK.Storage.prefix + key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        remove: (key) => {
            window.localStorage.removeItem(SDK.Storage.prefix + key);
        }
    }
};