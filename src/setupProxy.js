const {createProxyMiddleware} = require("http-proxy-middleware");
const config = require("./config")

module.exports = function (app) {
  //app.use(cors());

  app.use(
    "/socket.io",
    createProxyMiddleware({
      target: `http://${config.ip}:4000`,
      changeOrigin: true,
    }),
  );

  app.use(
    "/api",
    createProxyMiddleware({
      target: `http://${config.ip}:4000`,
      changeOrigin: true,
    }),
  );
};
