const SDK = {
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
    Posts: {
        findAll: (cb) => {
            SDK.request({
                method: "GET",
                url: "/posts",
                headers: {authorization: "Bearer " + SDK.Storage.load("token")}
            }, cb);
        },

        findPost: (event_id, cb) => {
            SDK.request({
                method: "GET",
                url: "/posts",
                date: event_id,
                headers: {authorization: "Bearer " + SDK.Storage.load("token")}
            }, cb);
        },



        create: (data, cb) => {
            SDK.request({
                method: "POST",
                url: "/posts",
                data: data,
                headers: {authorization: "Bearer " + SDK.Storage.load("token")}
            }, cb);
        }
    },

    Events: {
        createEvent: (owner_id, title, startDate, endDate, description , cb) => {
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
                headers: {
                   authorization: "Bearer " + SDK.Storage.load("token")
                }
            }, cb);
        }
    },
    User: {
        findAll: (cb) => {
            SDK.request({url: "/users", method: "GET"}, cb);
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
            }, cb )
        },
        current: () => {
            return SDK.Storage.load("userId");
        },
        logOut: () => {
            SDK.Storage.remove("token");
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

                SDK.Storage.persist("token", data);
                cb(null, data);


            });
        },
        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {
                const currentUser = true //SDK.User.current();
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