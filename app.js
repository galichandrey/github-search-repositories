let app = document.getElementById("app");
let appInnerWrapper = createElement("div", "app__inner-wrapper");

let searchLine = createElement("div", "search-line");
let searchInput = createElement("input", "search-input");
searchLine.append(searchInput);

let autocompleteBox = createElement("ul", "autocomplete-box");
searchLine.append(autocompleteBox);

let btn = createElement("button", "btn");

let main = createElement("div", "main");

app.append(appInnerWrapper);
appInnerWrapper.append(searchLine);
app.append(main);

function createElement(elementTag, elementClass) {
  const element = document.createElement(elementTag);
  if(elementClass) {
    element.classList.add(elementClass);
  } 
  return element;
}

function autocompleteShow(cardData) {
  const cardElement = createElement('li', 'card-preview');
  cardElement.addEventListener('click', () => {
    autocompleteBox.innerHTML = "";
    searchInput.value = "";

    showRepoData(cardData);
  });
  cardElement.innerHTML = `<span>${cardData.name}</span>`;
  autocompleteBox.append(cardElement);
}

function showRepoData(cardData) {
  const repoCard = createElement("li", "repo-card");
  const btn = createElement("div", "btn");

  repoCard.addEventListener("click", (e) => {
    autocompleteBox.innerHTML = "";
  });

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    repoCard.remove();
  })

  repoCard.innerHTML = `<span class="repo-card__info"><span>Name: ${cardData.name}</span>
  <span>Owner: ${cardData.owner.login}</span>
  <span>Stars: ${cardData.stargazers_count}</span>
  </span>`;
  repoCard.append(btn);
  main.prepend(repoCard);
}

searchInput.addEventListener('keyup', debounce(searchRepo.bind(this), 400));

async function searchRepo(){
  try {
    if(searchInput.value) {
      clearRepos();
      await fetch(`https://api.github.com/search/repositories?per_page=5&q=${searchInput.value}`)
      .then((response)=>{     
        response.json().then((response) => {
          response.items.forEach((repoData) => autocompleteShow(repoData));
        })
      });
    } else {
      clearRepos();        
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  } 

}

function clearRepos() {
  autocompleteBox.innerHTML = "";
}

function debounce (fn, debounceTime = 400) {
  let timeout;  
  
  return function () {
    const context = this;
    const args = arguments;

    function callFn(){
      return fn.apply(context, args);
    }

    clearTimeout(timeout);

    timeout = setTimeout(callFn, debounceTime);
  }
}
