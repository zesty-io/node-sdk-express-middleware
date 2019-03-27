> Express.js middleware for getting an authenticated Zesty instance on request handlers

```JavaScript
require("dotenv").config();

const server = require("express")();
const zesty = require('@zesty-io/sdk-express-middleware')

server.use(
  zesty({
    instance: process.env.ZESTY_INSTANCE_ZUID,
    token: process.env.ZESTY_INSTANCE_TOKEN
  })
);

server.get("/:contentModelZUID/items", async (req, res) => {
  const items = await req.app.locals.zesty.instance.getItems(req.params.contentModelZUID)
  res.send(items.data)
});

server.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});
