import { IProducts } from "./contracts/IProducts";

const productDisplay = document.getElementById('product-display') as HTMLDivElement;
const electronics = document.getElementById('electronics') as HTMLButtonElement;
const jewelery = document.getElementById('jewelery') as HTMLButtonElement;
const mensClothing = document.getElementById('mens-clothing') as HTMLButtonElement;
const womensClothing = document.getElementById('womens-clothing') as HTMLButtonElement;
const searchField = document.getElementById('search-field') as HTMLInputElement;
const sortBy = document.getElementById('sort-by') as HTMLSelectElement;

const BASE_URL = 'https://fakestoreapi.com/';
const PRODUCTS_URL = `${BASE_URL}products`;
let allProducts: IProducts[] = [];
let filteredProducts: IProducts[] = [];

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
}



function displayPressedCategory(products: IProducts[], tag: string) {
  filteredProducts = products.filter((product: IProducts) => product.category === tag);
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
});

jewelery.addEventListener('click',(event: Event) => {
  event.preventDefault();
  displayPressedCategory(allProducts, 'jewelery');
});

mensClothing.addEventListener('click',(event: Event) => {
  event.preventDefault();
  displayPressedCategory(allProducts, "men's clothing");
});

womensClothing.addEventListener('click',(event: Event) => {
  event.preventDefault();
  displayPressedCategory(allProducts, "women's clothing");
});

searchField.addEventListener('input',(event: Event) => {
  event.preventDefault();
  if(filteredProducts.length >= 1) {
    searchProducts(filteredProducts, searchField.value);
    filteredProducts = []
  
  } else {
    searchProducts(allProducts, searchField.value);

  }
});

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
