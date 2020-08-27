const {createProxyMiddleware} = require("http-proxy-middleware");
const config = require("./config")

module.exports = function (app) {
  app.use(
    "/socket.io",
    createProxyMiddleware({
      target: `http://${config.ip}:4000`,
      changeOrigin: true,
      ws: true
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
