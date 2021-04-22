const totalPriceGlobal = document.querySelector('span.total-price');
const olCartITemsElement = document.querySelector('ol.cart__items');
let total = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const customElement = document.createElement(element);
  customElement.className = className;
  customElement.innerText = innerText;
  return customElement;
}

const creatingNewElementP = () => {
  const newP = document.createElement('p');
  newP.innerText = total;
  totalPriceGlobal.appendChild(newP);
};

const removingElementP = () => {
  const firstElementSpan = totalPriceGlobal.firstElementChild;
  totalPriceGlobal.removeChild(firstElementSpan);
};

const localStoragestatus = () => {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('items', cartItems);
};

function cartItemClickListener(event) {
  const parentClick = event.target.parentNode;
  const childClick = event.target;
  parentClick.removeChild(childClick);
  total -= event.target.id;
  removingElementP();
  creatingNewElementP();
  localStoragestatus();
}

function createCartItemElement({ sku, name, salePrice }) {
  const listItem = document.createElement('li');
  listItem.className = 'cart__item';
  listItem.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  listItem.addEventListener('click', cartItemClickListener);
  return listItem;
}

async function somaFunction(eachPrice) {
  total += await eachPrice;
  const newPChild = document.createElement('p');
  newPChild.innerText = total;
  if (totalPriceGlobal.childNodes.length === 0) {
  totalPriceGlobal.appendChild(newPChild);
  } else {
    const firstChildTotalPrice = totalPriceGlobal.firstElementChild;
    totalPriceGlobal.removeChild(firstChildTotalPrice);
    totalPriceGlobal.appendChild(newPChild);
  }
}

const addItemOnCart = (event) => {
  const selectedSection = event.target.parentNode;
  const ItemID = selectedSection.firstChild.textContent;
  fetch(`https://api.mercadolibre.com/items/${ItemID}`)
    .then((element) => element.json()).then((json) => {
      const { price: salePrice, title: name, id: sku } = json;
      const newCartItem = createCartItemElement({ sku, name, salePrice });
      newCartItem.id = `${salePrice}`;
      olCartITemsElement.appendChild(newCartItem);
      somaFunction(salePrice);
      localStoragestatus();
    });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastChild.addEventListener('click', addItemOnCart);
  return section;
}

const clearCart = () => {
  const eachLi = document.querySelectorAll('li.cart__item');
  eachLi.forEach(() => olCartITemsElement.removeChild(olCartITemsElement.lastChild));
  removingElementP();
  total = 0;
  localStorage.clear();
};

const localStorageGetStatus = () => {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('items');
  const allItems = document.querySelectorAll('.cart__item');
  allItems.forEach((eachCartItem) => {
    eachCartItem.addEventListener('click', cartItemClickListener);
  });
};

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((jsonObject) => {
    jsonObject.results.forEach(({ title: name, id: sku, thumbnail: image }) => {
    const productItem = createProductItemElement({ sku, name, image });
    const items = document.querySelector('section.items');
    items.appendChild(productItem);
  });
  });
  const emptyCartButton = document.querySelector('button.empty-cart');
  emptyCartButton.addEventListener('click', clearCart);
  const newFirstElementP = document.createElement('p');
  totalPriceGlobal.appendChild(newFirstElementP);
  localStorageGetStatus();
};

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */
