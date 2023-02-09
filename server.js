import Express from "express";
import { read, write } from "./lib/files.js";
import { resolve } from "path";
import fileUpload from "express-fileupload";

let imgType = [
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/png",
  "image/svg",
];

const app = Express();

app.use(fileUpload());
app.use("/public", Express.static(resolve("public")));
app.use(Express.json());

app.get("/", (req, res) => {
  // index.html
  res.sendFile(resolve("index.html"));
});

app.get("/admin", (req, res) => {
  // index.html
  res.sendFile(resolve("public", "pages", "admin.html"));
});

app.get("/pages/news/:newsId", (req, res) => {
  // singleNews.html
  res.sendFile(resolve("public", "pages", "singleNews.html"));
});

app.get("/database/img/:img", (req, res) => {
  // for img /database/img/:img
  let { img } = req.params;
  res.sendFile(resolve("database", "img", img));
});

app.get("/news", (req, res) => {
  // get http://localhost:8000/news?title=&{title}
  let { title } = req.query;
  let newsArray = read();
  if (title) {
    newsArray = newsArray.filter((news) =>
      news.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  res.status(200).json(newsArray);
});

app.get("/news/:newsId", (req, res) => {
  // get http://localhost:8000/news/:id
  let newsArray = read();
  let { newsId } = req.params;
  let findNew = newsArray.find((news) => news.newsId == newsId);
  if (!findNew) {
    res.status(400).json({ status: 400, message: "did not find this news" });
  }
  res.status(200).json(findNew);
});

app.post("/news", (req, res) => {
  // { title : [length > 10], body: [lendth >20]}
  function addNull(a) {
    return a < 9 ? "0" + a : a;
  }
  try {
    let newsArray = read();
    let { title, body } = req.body;
    if (!req.files && !req.files?.image) {
      throw new Error("need to upload image");
    }

    let { image } = req.files;
    let { name, mimetype, size, mv } = image;

    if (!imgType.includes(mimetype)) {
      throw new Error("image type is wrong");
    }
    if (!(size < 5 * 1024 * 1024)) {
      throw new Error("image size is large");
    }

    if (!(title?.length > 20 && body?.length > 40)) {
      throw new Error("Wrong title or body");
    }

    let date = new Date();

    let create_at = `${addNull(date.getHours())}:${addNull(
      date.getMinutes()
    )}-${addNull(date.getDay())}.${addNull(
      date.getMonth()
    )}.${date.getFullYear()}`;

    let imgUrl = "database/img/" + date.getTime() + name;
    mv(imgUrl);
    newsArray.push({
      title,
      body,
      create_at,
      imgUrl,
      newsId: newsArray?.at(-1)?.newsId + 1 || 1,
    });

    write(newsArray);

    res.status(200).json({ status: 201, message: "news added" });
  } catch (err) {
    res.json(400, { status: 400, message: err.message });
  }
});

app.listen(8000, () => console.log("listen to " + 8000));
