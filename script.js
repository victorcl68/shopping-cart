const totalPriceGlobal = document.querySelector('span.total-price');
const olCartITemsElement = document.querySelector('ol.cart__items');
let total;
if (localStorage.length === 0) total = 0;
 else total = Number(localStorage.getItem('totalPrice'));

function valuesFixeds(element) {
  const elementToChange = element;
  const totalFixed = total.toFixed(2).toString();
  const resultCheck = totalFixed.substring(totalFixed.length - 2);
  const regex = /.0/i;
  if (resultCheck === '00') elementToChange.innerText = total.toFixed(0);
    else if (regex.test(resultCheck)) elementToChange.innerText = total.toFixed(1);
      else elementToChange.innerText = total.toFixed(2);
}

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
  valuesFixeds(newP);
  totalPriceGlobal.appendChild(newP);
  localStorage.setItem('totalPrice', newP.innerText);
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
  valuesFixeds(newPChild);
  if (totalPriceGlobal.childNodes.length === 0) {
    totalPriceGlobal.appendChild(newPChild);
  } else {
    const firstChildTotalPrice = totalPriceGlobal.firstElementChild;
    totalPriceGlobal.removeChild(firstChildTotalPrice);
    totalPriceGlobal.appendChild(newPChild);
  }
  localStorage.setItem('totalPrice', newPChild.innerHTML);
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

function endLoading() {
  const classLoading = document.querySelector('.container-loading');
  classLoading.remove();
}
// I had this idea by adapting a code from Lara Capila:
// https://github.com/tryber/sd-010-b-project-shopping-cart/pull/116

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((jsonObject) => {
    jsonObject.results.forEach(({ title: name, id: sku, thumbnail: image }) => {
    const productItem = createProductItemElement({ sku, name, image });
    const items = document.querySelector('section.items');
    items.appendChild(productItem);
  });
  endLoading();
  });
  const emptyCartButton = document.querySelector('button.empty-cart');
  emptyCartButton.addEventListener('click', clearCart);
  const newFirstElementP = document.createElement('p');
  newFirstElementP.innerHTML = localStorage.getItem('totalPrice');
  totalPriceGlobal.appendChild(newFirstElementP);
  localStorageGetStatus();
};

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */
