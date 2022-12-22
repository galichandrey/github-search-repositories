
class View {
  constructor(){
    this.app = document.getElementById("app");
    this.appInnerWrapper = this.createElement("div", "app__inner-wrapper");

    this.searchLine = this.createElement("div", "search-line");
    this.searchInput = this.createElement("input", "search-input");
    this.searchLine.append(this.searchInput);

    this.autocompleteBox = this.createElement("ul", "autocomplete-box");
    this.searchLine.append(this.autocompleteBox);
    
    this.btn = this.createElement("button", "btn");
   
    this.main = this.createElement("div", "main");

    this.app.append(this.appInnerWrapper);
    this.appInnerWrapper.append(this.searchLine);
    this.app.append(this.main);
  } 

  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if(elementClass) {
      element.classList.add(elementClass);
    } 
    return element;
  }

  autocompleteShow(userData) {
    const cardElement = this.createElement('li', 'card-preview');
    cardElement.addEventListener('click', () => {
      this.autocompleteBox.innerHTML = "";
      this.searchInput.value = "";

      this.showRepoData(userData);
    });
    cardElement.innerHTML = `<span>${userData.name}</span>`;
    this.autocompleteBox.append(cardElement);
  }

  showRepoData(userData) {
    const repoCard = this.createElement("li", "repo-card");
    const btn = this.createElement("div", "btn");

    repoCard.addEventListener("click", (e) => {
      this.autocompleteBox.innerHTML = "";
    });

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      repoCard.remove();
    })

    repoCard.innerHTML = `<span class="repo-card__info"><span>Name: ${userData.name}</span>
    <span>Owner: ${userData.owner.login}</span>
    <span>Stars: ${userData.stargazers_count}</span>
    </span>`;
    repoCard.append(btn);
    this.main.prepend(repoCard);
  }

}

class Search {

  constructor(view) {
    this.view = view;

    this.view.searchInput.addEventListener('keyup', this.debounce(this.searchRepo.bind(this), 400));
  
  }

  async searchRepo(){
    try {
      if(this.view.searchInput.value) {
        this.clearUsers();
        await fetch(`https://api.github.com/search/repositories?per_page=5&q=${this.view.searchInput.value}`)
        .then((response)=>{     
          response.json().then((response) => {
            response.items.forEach((repoData) => this.view.autocompleteShow(repoData));
          })
        });
      } else {
        this.clearUsers();        
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    } 

  }

  clearUsers() {
    this.view.autocompleteBox.innerHTML = "";
  }

  debounce (fn, debounceTime = 400) {
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


}

const search = new Search(new View());