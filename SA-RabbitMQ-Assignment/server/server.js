const PROTO_PATH = "./restaurant.proto";

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var restaurantProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");

const menu = [
  {
    id: "12f7673e-3259-4dde-9e8b-c781e6cc225c",
    name: "Fried rice",
    price: 60,
    type: "thai_food",
  },
  {
    id: "14f8c56e-69cf-4744-bec6-337db17c8a87",
    name: "Sukiyaki",
    price: 70,
    type: "thai_food",
  },
  {
    id: "8c7b5ba8-0152-4b48-a47f-e90253dcb69a",
    name: "Spaghetti",
    price: 130,
    type: "italian_food",
  },
  {
    id: "8c7b5ba8-0152-4b48-a47f-e90253dcb63a",
    name: "Italian pizza",
    price: 120,
    type: "italian_food",
  },
  {
    id: "8c7b5ba8-0152-4b48-a47f-e90253dcb69b",
    name: "Mochi",
    price: 15,
    type: "dessert",
  },
  {
    id: "8c7b5ba8-0152-4b48-a47f-e90253dab69b",
    name: "Yam rolled",
    price: 20,
    type: "dessert",
  },
];

const server = new grpc.Server();

server.addService(restaurantProto.RestaurantService.service, {
  /* Get All */
  getAllMenu: (_, callback) => {
    callback(null, { menu });
  },
  /* Get One */
  get: (call, callback) => {
    let menuItem = menu.find((n) => n.id == call.request.id);

    if (menuItem) {
      callback(null, menuItem);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
  /* Insert */
  insert: (call, callback) => {
    let menuItem = call.request;

    menuItem.id = uuidv4();
    menu.push(menuItem);
    callback(null, menuItem);
  },

  /* Update */
  update: (call, callback) => {
    let existingMenuItem = menu.find((n) => n.id == call.request.id);

    if (existingMenuItem) {
      existingMenuItem.name = call.request.name;
      existingMenuItem.price = call.request.price;
      existingMenuItem.type = call.request.type;
      callback(null, existingMenuItem);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not Found",
      });
    }
  },
  /* Delete */
  remove: (call, callback) => {
    let existingMenuItemIndex = menu.findIndex((n) => n.id == call.request.id);

    if (existingMenuItemIndex != -1) {
      menu.splice(existingMenuItemIndex, 1);
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "NOT Found",
      });
    }
  },
});

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();
