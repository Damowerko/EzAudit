const {createProxyMiddleware} = require("http-proxy-middleware");
const cors = require("cors");

module.exports = function (app) {
  app.use(cors);

  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:4000",
      changeOrigin: true,
    }),
  );
};
