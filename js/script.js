// Add form and input
const elForm = document.querySelector(".anime__form");
const elInput = elForm.querySelector(".anime__input");

// Add result list(ul)
const elResultList = document.querySelector(".amine__result-list");

// Add template
const elTemplate = document.querySelector("#anime__template").content;

// Add spinner
const elSpinner = document.querySelector(".anime__spinner");

// let bookmarkInfo = JSON.parse(localStorage.getItem("anime"))
// let bookmarkArr = bookmarkInfo || [];


const animeIDD = async name => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${name}&sfw`)
      .finally(spinnerAdd);
    const data = await response.json();


  }

  catch (err) {
    error(err);
    console.log("err");
  }
}

// Modal
const elModal = document.querySelector(".anime__modal");
const elModalInner = elModal.querySelector(".anime__modal-inner");
elModal.addEventListener("click", evt => {
  if (evt.target.matches(".anime__modal") || evt.target.matches(".btn-close")) {
    elModal.classList.remove("anime__modal-active");
    document.body.classList.remove("overr");

  } else {
    elModal.classList.add("anime__modal-active");
  }
})

// Modal render
function btnModal(btns, data) {
  btns.forEach(btn => {
    btn.addEventListener("click", () => {

      elModal.classList.add("anime__modal-active");
      document.body.classList.add("overr");

      const closeBtn = document.createElement("button");
      closeBtn.className = "position-absolute btn btn-close anime__close";
      closeBtn.type = "button";

      elModalInner.innerHTML = `
        <img class="rounded  anime__modal-img" src="${data.images.jpg.image_url}" alt="${data.title}" width="330" height="430">
       <div class="p-3 text-dark overflow-scroll">
        <h3 class="h5 "><span class="fw-bold text-danger ">Anime Name:</span> ${data.title}</h3>
        <p class="mb-1"><span class="fw-bold text-danger">Year:</span> ${data.year}</p>
        <p class="mb-1"><span class="fw-bold text-danger ">Episodes:</span> ${data.episodes}</p>
        <p class="mb-1"><span class="fw-bold text-danger">Rating:</span> ${data.score}</p>
        <p class="mb-1"><span class="fw-bold text-danger">Summury:</span> ${data.synopsis}</p>
       </div>
              `
      elModalInner.appendChild(closeBtn);
    })
  })
}

// Render anime
const rednderAnime = datum => {
  elResultList.innerHTML = null;

  const elFragment = document.createDocumentFragment();



  datum.forEach(data => {
    const copyFragment = elTemplate.cloneNode(true);

    copyFragment.querySelector(".anime__img-poster").src = data.images.jpg.image_url;
    copyFragment.querySelector(".anime__img-poster").alt = data.title;

    copyFragment.querySelector(".anime__card-title").innerHTML = data.title.split(" ").slice(0, 5).join(" ");

    copyFragment.querySelector(".anime__bookmark-button").dataset.malID = data.mal_id;

    const btns = copyFragment.querySelectorAll(".anime__more-info");

    btnModal(btns, data);


    elFragment.append(copyFragment);
  })

  elResultList.appendChild(elFragment);
}

// Error
function error(err) {
  elResultList.innerHTML = null;
  const errItem = document.createElement("li");
  errItem.className = "alert alert-danger";
  errItem.textContent = err;

  elResultList.appendChild(errItem);
}

// async fetch
const searchAnime = async name => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${name}&sfw`)
      .finally(spinnerAdd);
    const data = await response.json();
    // render
    rednderAnime(data.data);
    Bookdata(data.data)
    // console.log(data.data);

  }

  catch (err) {
    error(err);
    console.log("err");
  }
}

function spinnerRemove() {
  elSpinner.classList.remove("d-none");
}

function spinnerAdd() {
  elSpinner.classList.add("d-none");
}

searchAnime("shingeki no kyojin");

elForm.addEventListener("submit", evt => {
  evt.preventDefault();
  elResultList.innerHTML = null;
  spinnerRemove();

  const inputValue = elInput.value.toLowerCase().trim();

  searchAnime(inputValue);

  elInput.value = "";

})


function Bookdata(data) {
  elResultList.addEventListener("click", evt => {
    if (evt.target.matches(".anime__bookmark-button")) {
      let animeID = evt.target.dataset.malID;

      // console.log(animeID);
      let animeFind = data.find(item => item.mal_id == animeID);

      console.log(animeFind);

      // bookmarkArr.push(animeFind);

      // localStorage.setItem("anime", JSON.stringify(bookmarkArr));
    }
  })

}