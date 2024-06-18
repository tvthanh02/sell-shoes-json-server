const jsonServer = require("json-server");
const cors = require("cors");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

require("dotenv").config();

const port = process.env.PORT || 8080;

server.use(middlewares);
server.use(cors());
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.query.brand) {
    req.query.brand = req.query.brand.split(",");
  }
  next();
});

server.get("/product/:code", (req, res) => {
  const codeProduct = req.params.code;
  const product = router.db
    .get("products")
    .find({ productCode: codeProduct })
    .value();

  if (!product) {
    res.status(404).json({ error: "Item not found" });
  } else {
    res.json(product);
  }
});

server.get("/products", (req, res) => {
  const limit = 40;
  const { page = 0, brand, price, q } = req.query;
  const startIndex = page * limit;

  let products = router.db.get("products").value();

  if (!q) {
    products = products.sort((a, b) => {
      if (a["createdAt"] < b["createdAt"]) {
        return -1;
      }
      if (a["createdAt"] > b["createdAt"]) {
        return 1;
      }
      return 0;
    });
  }
  if (brand) {
    products = products.filter((product) => brand.includes(product.brand));
  }

  if (price) {
    products = products.filter((product) => product.price <= price);
  }

  if (q) {
    switch (q) {
      case "bestsell":
        products = products.sort((a, b) => {
          if (a["sales"] < b["sales"]) {
            return -1;
          }
          if (a["sales"] > b["sales"]) {
            return 1;
          }
          return 0;
        });
        break;
      case "promotion":
        products = products.sort((a, b) => {
          if (a["discount"] < b["discount"]) {
            return -1;
          }
          if (a["discount"] > b["discount"]) {
            return 1;
          }
          return 0;
        });
        break;
      default:
        products = [];
        break;
    }
  }

  const total = products.length;
  const paginatedProducts = products.slice(startIndex, startIndex + limit);

  res.json({
    data: paginatedProducts,
    paging: {
      totalPage: Math.ceil(total / limit),
      page: Number(page) + 1,
      limit,
    },
  });
});

server.listen(port, () => {
  console.log(`Port ${port} is listening....`);
});
