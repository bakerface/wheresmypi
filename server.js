/**
 * Copyright (c) 2016 Chris Baker <mail.chris.baker@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

var path = require("path");
var redis = require("redis");
var express = require("express");

var client = redis.createClient(process.env.REDIS_URL);
var app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.post("/", function (req, res) {
  client.hmset("locations." + req.ip, req.query, function (err) {
    if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).end();
  });
});

app.get("/:id", function (req, res) {
  client.hget("locations." + req.ip, req.params.id, function (err, location) {
    if (err) {
      return res.status(500).json(err);
    }

    if (location) {
      return res.redirect(location);
    }

    return res.status(404).end();
  });
});

app.get("/", function (req, res) {
  client.hgetall("locations." + req.ip, function (error, locations) {
    if (error) {
      return res.render("error", { error });
    }

    res.render("dashboard", {
      ip: req.ip,
      locations: locations || [],
    });
  });
});

app.listen(process.env.PORT || 3000);
