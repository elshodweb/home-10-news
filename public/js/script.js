let input = document.querySelector("#input");
let form = document.querySelector("#form");
let title = "";
input.addEventListener("input", (e) => {
  e.preventDefault();
  title = e.target.value;
});
form.addEventListener("submit", (e) => {
  reder(title);
  e.preventDefault();
});

async function reder(title) {
  let res = null;
  if (title) {
    res = await fetch(`/news?title=${title}`);
  } else {
    res = await fetch("/news");
  }

  let data = await res.json();
  let newsContainer = document.querySelector(".news");
  if (data.length > 0) {
    let fragment = document.createDocumentFragment();
    let template = document.querySelector("#card-template");

    for (let i = 0; i < data.length; i++) {
      const news = data[i];

      let clone = template.content.cloneNode(true);
      let link = clone.querySelector(".card");
      let title = clone.querySelector(".card__title");
      let img = clone.querySelector(".card__img");

      link.href = "pages/news/" + news.newsId;
      title.innerHTML = news.title;
      img.src = news.imgUrl;

      fragment.append(clone);
    }
    newsContainer.innerHTML = "";
    newsContainer.append(fragment);
  } else {
    newsContainer.innerHTML = "<h2>кидирув бойича хеч нарса топилмади</h2>";
  }
}
reder();
