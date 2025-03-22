const authRouter = require('./auth')
const apiRouter = require('./api/index.js')
const refreshTokenRouter = require('./refreshToken')
const path = require('path')
function route(app){
    app.use('/auth', authRouter)
    app.use('/', refreshTokenRouter)
    app.use('/api', apiRouter)
    app.all("*", (req, res) => {
        res.status(404);
        
        if (req.accepts("html")) {
            return res.sendFile(path.join(__dirname, "../views/404.html"), (err) => {
                if (err) {
                    res.status(500).send("Error loading the page");
                }
            });
        } else if (req.accepts("json")) {
            return res.json({
                error: "404 Not Found",
            });
        } else {
            return res.type("txt").send("404 Not Found");
        }
    });
}

module.exports = route
