import { DEFAULT_ECDH_CURVE } from 'tls';

var HTTP = require('http');
var PATH = require('path');
var FS   = require('fs');
var OS   = require('os');
var UTIL = require("util");

var hostname = '127.0.0.1';
var port = 3000;

console.log("rootDir = " + rootDir);

function HttpContext(request, response) {
    var originalUrl = HttpContext.asString(request.url);
    var segments = [];
    var query = [];
    var content = "";
    this.setContent = function(s) { content = HttpContext.asString(s); };
    this.setTitle = function(s) { title = HttpContext.asString(s); };
    this.write = function(s) {
        s = HttpContext.asString(s);
        if (s.length > 0)
            content += s;
    };
    this.writeLine = function(s) { this.write(HttpContext.asString(s) + OS.EOL); };
    var title = "";
    var statusCode = 200;
    var scheme, origin, userName, password, host, port, originalPath, path, leaf, queryString, fragment;
    var match = HttpContext.urlRe.exec(originalUrl);
    if (HttpContext.isNil(match)) {
        if (originalUrl.length > 0)
            segments = [unescape(originalUrl)];
        originalPath = originalUrl;
    } else {
        var s = match[1];
        if (!HttpContext.isNil(s)) {
            origin = s;
            s = match[3];
            if (!HttpContext.isNil(s))
                scheme = s;
            s = match[6];
            if (!HttpContext.isNil(s))
                userName = unescape(s);
            s = match[8];
            if (!HttpContext.isNil(s))
                password = unescape(s);
            s = match[9];
            if (!HttpContext.isNil(s))
                ost = unescape(s);
            s = match[11];
            if (s.length > 0)
                port = parseInt(s);
        }
        s = match[12];
        if (!HttpContext.isNil(s)) {
            originalPath = s;
            segments = HttpContext.getPathSegments(s);
        }
        s = match[14];
        if (HttpContext.isNil(s))
            query = [];
        else {
            queryString = s;
            if (s.length == 0)
                this.query = [];
            else
                this.query = s.split("&").map(function(q) {
                    var a = q.split("=", 2);
                    if (a.length == 2)
                        return { key: unescape(a[0]), value: unescape(a[1]) };
                    return { key: unescape(a[0]) };
                });
        }
        s = match[16];
        if (!HttpContext.isNil(s))
            this.fragment = s;
    }
    if (segments.length == 0) {
        leaf = "default.html";
        path = "/" + leaf;
        segments.push(leaf);
    } else if (segments.length == 1) {
        leaf = segments[0];
        path = "/" + segments[0];
    } else {
        path = "/" + segments.join("/");
        leaf = segments[segments.length - 1];
    }

    var extension = PATH.posix.extname(leaf);
    if (HttpContext.isNil(extension))
        extension = "";
    else
        extension = ((extension.length > 1 && extension.startsWith(".")) ? extension.substr(1) : extension).toLowerCase();
    var arr = HttpContext.ContentTypes.filter(function(c) { return (c.extensions.filter(function(e) { return (e == this)}, this).length > 0); }, extension);
    contentType = (arr.length > 0) ? arr[0].type : "application/octet-stream";
    this.endResponseError = function(err, response, statusMessage, statusCode) {
        var mLines = [];
        switch (typeof(err)) {
            case "string":
            case "undefined":
                break;
            default:
                if (err !== null) {
                    var m = HttpContext.asString(err.message, true);
                    if (m.length > 0)
                        mLines.push(m);
                }
                break;
        }
        
        statusMessage = HttpContext.asString(statusMessage);
        if (statusMessage.length > 0 && (mLines.length == 0 || mLines[0] != statusMessage))
            mLines.unshift(statusMessage);
        if (mLines.length == 0)
            mLines.push("Unexpected fault condition");
        response.statusMessage = mLines[0];
        response.setHeader('Content-Type', 'text/plain');
        var s = JSON.stringify(err);
        if ((mLines.filter(function(v) { return (v == JSON.stringify(this)); }, s)).length == 0)
            mLines.push(s);
        content = mLines.map(function(l) { return HttpContext.encodeHTML(l); }).join("<br/>");
        console.error(mLines.join("\n"));
        this.endResponseTemplate((typeof(statusCode) != "number") ? 404.14 : statusCode, statusMessage);
    };

    this.endResponseTemplate = function(statusCode, statusMessage) {
        if (!HttpContext.isNil(statusCode)) {
            if (typeof(statusCode) != "number")
                try {
                    statusCode = parseFloat(statusCode);
                    if (isNaN(statusCode))
                        statusCode = null;
                } catch (err) { statusCode = null; }
        }
        response.statusCode = (HttpContext.isNil(statusCode)) ? 200 : statusCode;
        var s = HttpContext.asString(statusMessage);
        if (s.length > 0)
        response.statusMessage = s;
        response.setHeader('Content-Type', "text/html");
        response.end(HttpContext.TemplateHtml.replace("{Body}", content).replace("{Title}", HttpContext.encodeHTML(title)));
    };

    this.getUrlString = function() {
        var s = (segments.length == 0) ? "/" : "/" + ((segments.length == 1) ? escape(segments[0]) :
            segments.map(function(p) { return escape(p); }));
        var qs = query.map(function(q) {
            if (HttpContext.isNil(q))
                return null;
            if (HttpContext.isNil(q.key)) {
                if (HttpContext.isNil(q.value))
                    return escape(value);
                return escape(q.value);
            }
            if (HttpContext.isNil(q.value))
                return escape(q.key);
            return escape(q.key) + "=" + escape(q.value);
        }).filter(function(q) { return (q !== null); });
        if (qs.length == 1)
            s += ("?" + qs[0]);
        else if (qs.length > 1)
            s += ("?" + qs.join("&"));
        if (!HttpContext.isNil(fragment))
            s += ("#" + escape(fragment));
        if (HttpContext.isNil(host))
            return s;
        if (!HttpContext.isNil(port))
            s = ":" + port + s;
        s = escape(host) + s;
        if (!HttpContext.isNil(username)) {
            s = "@" + s;
            if (!HttpContext.isNil(password))
                s = ":" + escape(password) + s;
            s = escape(username) + s;
        } else if (!HttpContext.isNil(password))
            s = ":" + escape(password) + "@" + s;
        s = "://" + s;
        if (!HttpContext.isNil(scheme))
            return scheme + s;
        return s;

    };

    this.endResponseFile = function(path, skip) {
        if (typeof(skip) != "number" || skip < 0)
            skip = 0;
        for (var i = skip; i < segments.length; i++)
            path = PATH.join(path, segments[i]);
        if (!FS.existsSync(path)) {
            content = " file not found";
            this.endResponseTemplate(404);
            return;
        }
        FS.stat(path, function(err, stats) {
            if (err)
                HtmlHelper.endResponseError(err, response, "Error checking file.");
            if (stats.isDirectory()) {
                content = " file not found";
                this.endResponseTemplate(404);
                return;
            }
            FS.readFile(path, {}, function(data, err) {
                if (err)
                    HtmlHelper.endResponseError(err, response, "Error loading file.");
                else {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', contentType);
                    response.end(data);
                }
            });
        });
    };
}
HttpContext.separatorRe = /[\/\\]+/g;
HttpContext.urlRe = /^((([^:\/\\/?/#]*):)((([^:@/?/#]*)(:([^@/?/#]*))?@)?([^\/\\/?/#:]*)(:(\d+))?)?)?([^\?\#]*)(\?([^\#]*))?(\#(.*))?/;
HttpContext.urlSchemeRe = /(([^:\/\\/?/#]*):)/;
HttpContext.urlAuthRe = /(([^:@/?/#]*)(:([^@/?/#]*))?@)?/;
HttpContext.urlHostRe = /([^\/\\/?/#:]*)(:(\d+))?/;
HttpContext.urlHostRe = /(([^:@/?/#]*)(:([^@/?/#]*))?@)?([^\/\\/?/#:]*)(:(\d+))?/;
HttpContext.urlPathQueryRe = /([^\?\#]*)(\?([^\#]*))?(\#(.*))?/;
HttpContext.WebRoot = PATH.resolve(__dirname, "webroot");
HttpContext.DistroRoot = PATH.resolve(PATH.dirname(PATH.dirname(__dirname)), "Dist");
HttpContext.ContentTypes = [
    { type: "text/html", extensions: ["htm", " html"] },
    { type: "text/css", extensions: ["css"] },
    { type: "text/json", extensions: ["json"] },
    { type: "text/javascript", extensions: ["js"] },
    { type: "text/plain", extensions: ["txt"] },
    { type: "text/xml", extensions: ["xml", "xslt", "xsd"] },
    { type: "image/png", extensions: ["png"] },
    { type: "image/jpeg", extensions: ["jpg", "jpeg"] },
    { type: "image/gif", extensions: ["gif"] }
];
HttpContext.getPathSegments = function(path) {
    var segments = [];
    var i;
    var aa = HttpContext.asString(path).split(HttpContext.separatorRe).map(function(s) {
        return unescape(s).split(this).filter(function(v) { return (v.length > 0 && v != "."); });
    }, HttpContext.separatorRe);
    for (i = 0; i < aa.length; i++) {
        var a = aa[i];
        for (var n = 0; n < a.length; n++)
            segments.push(a[n]);
    }
    for (i = 0; i < segments.length; i++) {
        if (segments[i] != "..")
            continue;
        if (i == 0)
            throw new Error("Relative path segment cannot extend above root.");
        i--;
        segments.splice(i, 2);
        i--;
    }
    return segments;
};
HttpContext.isNil = function(value) { return (typeof(value) == "undefined" || value === null); };
HttpContext.asString = function(value, trim) {
    switch (typeof(value)) {
        case "undefined":
            break;
        case "string":
            return (trim) ? value.trim() : value;
        default:
            if (value !== null) {
                var s = value.toString();
                switch (typeof(s)) {
                    case "undefined":
                        break;
                    case "string":
                        return (trim) ? s.trim() : s;
                    default:
                        if (s !== null) {
                            s = s+"";
                            return (trim) ? s.trim() : s;
                        }
                        break;
                }
            }
            break;
    }
    return "";
};
HttpContext.encodeHTML = function(data) {
    return HttpContext.asString(data).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
};

var server = HTTP.createServer(function(request, response) {
    console.log(request.method + ": " + request.url);
    var context = new HttpContext(request, response);
    if (request.method != "GET") {
        var m = request.method + " method not supported.";
        context.setContent(HttpContext.encodeHTML(m));
        context.endResponse(405, m);
        return;
    }
    switch (url.segments[0]) {
        case "__cmd":
            if (url.segments.length == 2 && url.segments[1] == "stop") {
                context.setContent("Server closed");
                context.endResponseTemplate();
                server.removeAllListeners();
                server.close();
            }
            break;
        case "__script":
            context.endResponseFile(HttpContext.DistroRoot, 1);
            break;
    }
    context.endResponseFile(HttpContext.WebRoot);
});

FS.readFile(PATH.join(HttpContext.WebRoot, "default.html"), {}, function(data, err) {
    if (err)
        throw err;
    HttpContext.DefaultHtml = data;

    FS.readFile(PATH.join(__dirname, "template.html"), {}, function(data, err) {
        if (err)
            throw err;
        j = data;
    
        server.listen(port, hostname, function() {
          console.log("Server running at http://" + hostname + ":" + port + "/");
        });
    });
});