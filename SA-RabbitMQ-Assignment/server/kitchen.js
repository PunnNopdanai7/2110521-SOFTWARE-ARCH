#!/usr/bin/env node

var amqp = require("amqplib/callback_api");

console.log(
  "Type mode to subscribe: 'thai_food', 'italian_food', or 'dessert'"
);
const input_arguments = process.argv.slice(2);
console.log(input_arguments);

if (input_arguments.length < 1) {
  process.exit(1);
}

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const exchange = "order_queue";

    channel.assertExchange(exchange, "direct", {
      durable: false,
    });

    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, queue) {
        if (error2) {
          throw error2;
        }

        input_arguments.forEach((elem) => {
          channel.bindQueue(queue.queue, exchange, elem);
        });

        channel.consume(queue.queue, (elem) => {
          console.log(
            ` [x] ${elem.fields.routingKey}: ${elem.content.toString()}`
          );
        });
      },
      {
        noAck: false,
      }
    );
  });
});
