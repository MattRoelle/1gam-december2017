var server = require("node-http-server");

server.deploy({
	port: "1234",
	verbose: true,
    contentType : {
        html: 'text/html',
        css: 'text/css',
        js: 'text/javascript',
        json: 'application/json',
        txt: 'text/plain',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        ico: 'image/x-icon',
        appcache: 'text/cache-manifest',
        wav: "audio/wav",
        ttf: "font/ttf",
        ogg: "audio/ogg"
    }
});
