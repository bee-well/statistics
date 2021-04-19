const app = require("./app")

const start = () => {
    app.listen(app.get("port"), () => {
        console.log(`server is listening on port ${app.get("port")}`)
    })
}

start()