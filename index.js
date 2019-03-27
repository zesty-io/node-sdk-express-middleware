"use strict";

const SDK = require("@zesty-io/sdk");

module.exports = config => {
  return async (req, res, next) => {
    if (!config.instance) {
      console.error(
        "zesty-express-middleware: Missing required `instance` config"
      );
    }

    if (!config.token) {
      if (!config.email) {
        console.error(
          "zesty-express-middleware: Missing required `email` config"
        );
      }
      if (!config.password) {
        console.error(
          "zesty-express-middleware: Missing required `password` config"
        );
      }
    } else if (!config.email && !config.password) {
      console.error(
        "zesty-express-middleware: Missing authentication strategy. Either a service `token` or `email` and `password` must be provided."
      );
    }

    if (!config.options) {
      config.options = {};
    }

    const token = config.token || req.app.locals.zesty_token;

    if (!token) {
      try {
        // Auth and store issued token on app
        const auth = new SDK.Auth({ authURL: config.options.authURL });
        const loginResponse = await auth.login(config.email, config.password);
        req.app.locals.zesty_token = loginResponse.token;
      } catch (err) {
        console.log("Failed to auth SDK: ", err);
        res.status(err.errorCode).send({
          error: err.errorMessage
        });
        return;
      }
    } else {
      req.app.locals.zesty_token = token;
    }

    req.app.locals.zesty = new SDK(
      config.instance,
      req.app.locals.zesty_token,
      {
        logErrors: true,
        logResponses: false,
        ...config.options
      }
    );

    next();
  };
};
