const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

//////////////////////////////////////////
///SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCards = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url);
  const { searchParams, pathname: pathName } = new URL(
    `https://127.0.0.1:8000${req.url}`
  );

  // OVERVIEW PAGE
  if (pathName === "/overview" || pathName === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCards, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
  }

  //PRODUCT PAGE
  else if (pathName === "/product") {
    const product = dataObj.find((el) => el.id == searchParams.get("id"));
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  }

  //API
  else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);
  }

  //NOT FOUND
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening on port 8000");
});
