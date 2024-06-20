import { IProducts } from "./contracts/IProducts";

const productDisplay = document.getElementById('product-display') as HTMLDivElement;
const electronics = document.getElementById('electronics') as HTMLButtonElement;
const jewelery = document.getElementById('jewelery') as HTMLButtonElement;
const mensClothing = document.getElementById('mens-clothing') as HTMLButtonElement;
const womensClothing = document.getElementById('womens-clothing') as HTMLButtonElement;
const searchField = document.getElementById('search-field') as HTMLInputElement;
const sortBy = document.getElementById('sort-by') as HTMLSelectElement;
const loadingIndicator = document.getElementById('loading') as HTMLDivElement;
const darkMode = document.querySelector('.dark-mode') as HTMLButtonElement;
const getBody = document.querySelector('body') as HTMLBodyElement;
const category = document.getElementById('mobile-menu') as HTMLSelectElement;

const BASE_URL = 'https://fakestoreapi.com/';
const PRODUCTS_URL = `${BASE_URL}products`;
let allProducts: IProducts[] = [];
let filteredProducts: IProducts[] = [];
let currentFilteredProducts: IProducts[] = [];

let isElectronicsSelected = false;
let isJewelerysSelected = false;
let isMensSelected = false;
let isWomensSelected = false;

function fetchClothing() {
    fetch(PRODUCTS_URL)
    .then((response: Response) => {
        if (!response.ok) {
            throw Error(`${response.status} ${response.statusText}`);
          }
          return response.json();
    })
    .then((products: IProducts[]) => {
        displayProducts(products);
        allProducts = products;
    })
  }

  fetchClothing();

  function displayProducts(products: IProducts[]): void  {
    loadingIndicator.style.display = 'block';
    productDisplay.innerHTML = ''
    setTimeout(() => {
      loadingIndicator.style.display = 'none';
      const createEachProduct = products.map((product: IProducts) => {  
        return `
        <div class="product-container">
        <img class="picture" src="${product.image}" alt="">
        <h3>${product.title}</h3>
        <div class="price-and-button-div">
        <h2>$ ${product.price.toFixed(2)}</h2>
        <button class="add-to-cart">Add to cart</button>
        </div>
        </div>
        `;
      });
      productDisplay.innerHTML = createEachProduct.join('');
    }, 50000);
}

function displayPressedCategory(products: IProducts[], tag: string) {
  filteredProducts = products.filter((product: IProducts) => product.category === tag);
  currentFilteredProducts = [...filteredProducts];
  displayProducts(filteredProducts);
}

function searchProducts(products: IProducts[], tag: string) {
  filteredProducts = products.filter((product: IProducts) => 
    product.title.toLocaleLowerCase().includes(tag.toLocaleLowerCase())
  );
  displayProducts(filteredProducts);
}

electronics.addEventListener('click',(event: Event) => {
  event.preventDefault();
  displayPressedCategory(allProducts, 'electronics');
  isElectronicsSelected = true;
  isJewelerysSelected = false;
  isMensSelected = false;
  isWomensSelected = false;
  changeButtonColor()
});

jewelery.addEventListener('click',(event: Event) => {
  event.preventDefault();
  displayPressedCategory(allProducts, 'jewelery');
  isElectronicsSelected = false;
  isJewelerysSelected = true;
  isMensSelected = false;
  isWomensSelected = false;
  changeButtonColor()
});

mensClothing.addEventListener('click',(event: Event) => {
  event.preventDefault();
  displayPressedCategory(allProducts, "men's clothing");
  isElectronicsSelected = false;
  isJewelerysSelected = false;
  isMensSelected = true;
  isWomensSelected = false;
  changeButtonColor()
});

womensClothing.addEventListener('click',(event: Event) => {
  event.preventDefault();
  displayPressedCategory(allProducts, "women's clothing");
  isElectronicsSelected = false;
  isJewelerysSelected = false;
  isMensSelected = false;
  isWomensSelected = true;
  changeButtonColor()
});

function changeButtonColor() {
  electronics.style.backgroundColor = isElectronicsSelected ? 'rgb(203, 142, 27)' : '';
  jewelery.style.backgroundColor = isJewelerysSelected ? 'rgb(203, 142, 27)' : '';
  mensClothing.style.backgroundColor = isMensSelected ? 'rgb(203, 142, 27)' : '';
  womensClothing.style.backgroundColor = isWomensSelected ? 'rgb(203, 142, 27)' : '';
}

sortBy.addEventListener('change', (event: Event) => {
  event.preventDefault();
  if (sortBy.value === 'lowest') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'highest') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  displayProducts(filteredProducts);
  sortBy.value = '';
});


searchField.addEventListener('input',(event: Event) => {
  event.preventDefault();
  const searchValue = searchField.value.trim();

  if (searchValue === '') {

    displayProducts(currentFilteredProducts.length > 0 ? currentFilteredProducts : allProducts);
  } else {

    searchProducts(currentFilteredProducts.length > 0 ? currentFilteredProducts : allProducts, searchValue);
  }
});

darkMode.addEventListener('click', () => {
  if (darkMode.textContent === 'Dark Mode') {
    darkMode.textContent = 'Light Mode';
    getBody.style.backgroundColor = 'black';
    darkMode.style.color = 'black';
    darkMode.style.backgroundColor = 'white';
  } else {
    darkMode.textContent = 'Dark Mode';
    getBody.style.backgroundColor = '#efefee';
    darkMode.style.color = 'white';
    darkMode.style.backgroundColor = 'black';
  }
});

category.addEventListener('change', (event: Event) => {
  event.preventDefault();
  if (category.value === 'electronics') {
      displayPressedCategory(allProducts, 'electronics');
    } else if (category.value === 'jewelery') {
      displayPressedCategory(allProducts, 'jewelery')
    } else if (category.value === 'mens-clothing') {
      displayPressedCategory(allProducts, "men's clothing")
    } else if (category.value === 'womens-clothing') {
      displayPressedCategory(allProducts, "women's clothing")
    }
  category.value = '';
});