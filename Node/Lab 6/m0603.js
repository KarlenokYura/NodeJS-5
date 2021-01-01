var sendmail = require("sendmail") ({silent: true});

function send(letter) {
    sendmail({
        from: "karlenok.yuriy@gmail.com",
        to: "karlenok.yuriy@gmail.com",
        subject: "Sendmail example",
        html: letter.toString()
    })
}

module.exports = send;