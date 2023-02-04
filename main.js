const output = document.getElementById("output");
const restoreBtn = document.getElementById("restore-btn");

const nextPageButton = document.querySelector(".next");
const prevPageButton = document.querySelector(".prev");
let currentPage = 1;
const currentPageNumber = document.querySelector(".curr-page");

const statusSelect = document.getElementById("status-select");

const searchBtn = document.getElementById("search");

let dataGlobal = [];

const renderList = (elements) => {
  return elements
    .map(
      (current) =>
        `<li>
    <img src="${current.image}">
      <div class="wrap-item">
        <div class='name-content'>Имя:
            <p>${current.name}</p>
        </div>
        <div class='name-content'>Статус:
            <p> ${current.status}</p>
        </div>
        <div class='name-content'>Раса: 
            <p>${current.species}</p>
        </div>
        <button btn-name="delete">Delete Block</button>
      </div>
  </li>`
    )
    .join("");
};

async function fetchData(pagNum) {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/?page=${pagNum}`
  );
  const data = await response.json();
  return data;
}

//Кнопка вперед
nextPageButton.addEventListener("click", () => {
  currentPage++;
  currentPageNumber.textContent = currentPage;

  fetchData(currentPage).then((data) => {
    dataGlobal = data.results;
    if (data.info.next === null) {
      nextPageButton.setAttribute("disabled", true);
    }
    if (data.info.prev !== null) {
      prevPageButton.removeAttribute("disabled");
    }
    output.innerHTML = renderList(dataGlobal);
  });
});

//Кнопка назад
prevPageButton.addEventListener("click", () => {
  currentPage--;
  currentPageNumber.textContent = currentPage;

  fetchData(currentPage).then((data) => {
    dataGlobal = data.results;
    if (data.info.next !== null) {
      nextPageButton.removeAttribute("disabled", true);
    }
    if (data.info.prev === null) {
      prevPageButton.setAttribute("disabled", true);
    }
    output.innerHTML = renderList(dataGlobal);
  });
});

//Поиск персонажей
searchBtn.addEventListener("click", () => {
  let searchInput = document.getElementById("search-input");
  let searchRadio = document.querySelector('input[name="status"]:checked');
  if (!searchInput.value) {
    alert("Please enter a value in the search input field.");
    searchInput.value = "";
    return;
  }
  if (!searchRadio) {
    fetch(
      `https://rickandmortyapi.com/api/character/?name=${searchInput.value}`
    )
      .then((res) => res.json())
      .then((data) => {
        dataGlobal = data.results;
        output.innerHTML = renderList(dataGlobal);
        searchInput.value = "";
      })
      .catch(() => {
        searchInput.value = "";
        alert("Please enter a correct value in the search input field.");
      });
    return;
  }
  fetch(
    `https://rickandmortyapi.com/api/character/?name=${searchInput.value}&status=${searchRadio.value}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      dataGlobal = data.results;
      output.innerHTML = renderList(dataGlobal);
      searchInput.value = "";
    })
    .catch(() => {
      searchInput.value = "";
      alert("Please enter a correct value in the search input field.");
    });
});

//Первый рендер и выбор LI
fetchData(currentPage).then((data) => {
  dataGlobal = data.results;
  currentPageNumber.textContent = currentPage;
  output.innerHTML = renderList(dataGlobal);

  //Добавление модального окна и затемнения
  function openModal() {
    const modal = document.querySelector("#modal");
    const closeButton = document.querySelector("#close-modal");
    const overlay = document.querySelector(".overlay");

    modal.style.display = "flex";
    overlay.style.display = "block";

    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
      overlay.style.display = "none";
    });

    overlay.addEventListener("click", () => {
      modal.style.display = "none";
      overlay.style.display = "none";
    });
  }

  output.addEventListener("click", (e) => {
    const modalContent = document.querySelector(".modal-content");
    let target = e.target.closest("li");
    if (target) {
      let allLi = document.querySelectorAll("li");
      allLi.forEach((li) => {
        li.classList.remove("active");
      });
      target.classList.add("active");

      const res = document.querySelector(".res span");
      res.textContent = target.querySelectorAll("p")[0].textContent;

      //Узнаем индекс LI и подставляемс с него данные 
      const index = Array.from(allLi).indexOf(target);
      const modalData = dataGlobal[index];

      //Рендер инф. в модальном окне
      modalContent.innerHTML = `
      <h5>${modalData.name}</h5>
      <img src='${modalData.image}'> 
      <p>${modalData.species}</p> 
      `;

      if (e.target.matches('button[btn-name="delete"]')) {
        target.remove();
        res.textContent = "";
      }else {
        openModal();
      }
    }
  });

  //Функционал кнопки Restor
  restoreBtn.addEventListener("click", (e) => {
    const listItems = document.querySelectorAll("li");
    const result = document.querySelector(".res span");
    

    if (listItems.length > 0) {
      listItems.forEach((item) => {
        item.remove();
        result.textContent = "";
      });
    }
    output.innerHTML = renderList(dataGlobal);
  });
});
