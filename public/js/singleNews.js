let NEWS_ID = window.location.pathname.split("/").at(-1);

!(async function (params) {
  let res = await fetch("/news/" + NEWS_ID);
  let news = await res.json();
  let container = document.querySelector(".container");

  let template = document.querySelector("#template");
  let clone = template.content.cloneNode(true);
  let title = clone.querySelector(".news__title");
  let img = clone.querySelector(".news__img");
  let desc = clone.querySelector(".news__desc");
  let date = clone.querySelector(".news__date");
  title.innerHTML = news.title;
  img.src = "../../" + news.imgUrl;
  desc.innerHTML = news.body;
  date.innerHTML = news.create_at;

  container.append(clone);
})();
