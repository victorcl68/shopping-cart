// Código quebra com soma de números com decimais ou com fato do preço total ser filho de um elemento total-price
let total = 0;
const totalPriceGlobal = document.querySelector('span.total-price');

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

function cartItemClickListener(event) {
  const parentClick = event.target.parentNode;
  const childClick = event.target;
  parentClick.removeChild(childClick);
  total -= event.target.id;
  removingElementP();
  creatingNewElementP();
}

function createCartItemElement({ sku, name, salePrice }) {
  const listItem = document.createElement('li');
  listItem.className = 'cart__item';
  listItem.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  listItem.addEventListener('click', cartItemClickListener);
  return listItem;
}

function somaFunction(eachPrice) {
  total += eachPrice;
  const newPChild = document.createElement('p');
  newPChild.innerText = total;
  if (totalPriceGlobal.childNodes.length === 0) {
  totalPriceGlobal.appendChild(newPChild);
  } else if (totalPriceGlobal.childNodes.length > 0) {
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
      const olParent = document.querySelector('ol.cart__items');
      olParent.appendChild(newCartItem);

      somaFunction(salePrice);
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
  const parentOlCart = document.querySelector('ol.cart__items');
  const eachLi = document.querySelectorAll('li.cart__item');
  eachLi.forEach(() => parentOlCart.removeChild(parentOlCart.lastChild));
  removingElementP();
  total = 0;
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

  const mySpan = document.querySelector('span.total-price');
  const myP = document.createElement('p');
  mySpan.appendChild(myP);
};

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */
