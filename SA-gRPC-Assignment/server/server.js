const connectDB = require("../config/db");
connectDB();

const Menu = require("../models/Menu");
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

const server = new grpc.Server();

server.addService(restaurantProto.RestaurantService.service, {
  getAllMenu: async (_, callback) => {
    try {
      const menu = await Menu.find();
      callback(null, { menu });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Error occured",
      });
    }
  },
  get: async (call, callback) => {
    try {
      const menuItem = await Menu.findById(call.request.id);

      if (!menuItem) {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Menu not found",
        });
      }

      callback(null, { menuItem });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Error occured",
      });
    }
  },
  insert: async (call, callback) => {
    const name = call.request.name;
    const price = call.request.price;

    try {
      const menuItem = await Menu.create({
        name: name,
        price: price,
      });

      callback(null, menuItem);
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Error occured",
      });
    }
  },
  update: async (call, callback) => {
    const id = call.request.id;
    const name = call.request.name;
    const price = call.request.price;
    try {
      const menuItem = await Menu.findByIdAndUpdate(id, {
        name: name,
        price: price,
      });

      if (!menuItem) {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Menu not found",
        });
      }

      callback(null, menuItem);
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Error occured",
      });
    }
  },
  remove: async (call, callback) => {
    const id = call.request.id;
    const name = call.request.name;
    const price = call.request.price;
    try {
      const menuItem = await Menu.findByIdAndDelete(id, {
        name: name,
        price: price,
      });

      if (!menuItem) {
        callback({
          code: grpc.status.NOT_FOUND,
          details: "Menu not found",
        });
      }

      callback(null, menuItem);
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        details: "Error occured",
      });
    }
  },
});

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();
