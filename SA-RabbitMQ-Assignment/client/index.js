const client = require("./client");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  client.getAllMenu(null, (err, data) => {
    if (!err) {
      res.render("menu", {
        results: data.menu,
      });
    }
  });
});

var amqp = require("amqplib/callback_api");

app.post("/placeorder", (req, res) => {
  const orderItem = {
    id: req.body.id,
    name: req.body.name,
    quantity: req.body.quantity,
    type: req.body.type,
  };

  // Send the order msg to RabbitMQ
  amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      const exchange = "order_queue";
      const tmp = orderItem.type ? orderItem.type : "none";
      console.log(tmp);
      //var msg = process.argv.slice(2).join(' ') || "Hello World!";

      channel.assertExchange(exchange, "direct", {
        durable: false,
      });
      channel.publish(exchange, tmp, Buffer.from(JSON.stringify(orderItem)));
      console.log(` [x] Sent:`);
      console.log(orderItem);
    });

    setTimeout(() => {
      connection.close();
    }, 500);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at port %d", PORT);
});
