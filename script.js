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

function cartItemClickListener(event) {
  const parentClick = event.target.parentNode;
  const childClick = event.target;
  parentClick.removeChild(childClick);
}

function createCartItemElement({ sku, name, salePrice }) {
  const listItem = document.createElement('li');
  listItem.className = 'cart__item';
  listItem.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  listItem.addEventListener('click', cartItemClickListener);
  return listItem;
}

const addItemOnCart = (event) => {
  const selectedSection = event.target.parentNode;
  const ItemID = selectedSection.firstChild.textContent;
  console.log(ItemID);
  fetch(`https://api.mercadolibre.com/items/${ItemID}`)
    .then((element) => element.json()).then((json) => {
      const { price: salePrice, title: name, id: sku } = json;
      const newCartItem = createCartItemElement({ sku, name, salePrice });
      const olParent = document.querySelector('ol.cart__items');
      olParent.appendChild(newCartItem);
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
/* let total = 0;
Estava dentro da funcçao createproductitemelement 
        total += salePrice;
        const totalPrice = document.querySelector('span.total-price');
        const newChild = document.createElement('p');
        newChild.innerText = total;
        if (totalPrice.childNodes.length === 0) {
        totalPrice.appendChild(newChild);
        } else if (totalPrice.childNodes.length > 0) {
          const f = totalPrice.firstElementChild;
          totalPrice.removeChild(f);
          totalPrice.appendChild(newChild);
        } */

const clearCart = () => {
  const parentOlCart = document.querySelector('ol.cart__items');
  const eachLi = document.querySelectorAll('li.cart__item');
  eachLi.forEach(() => {
    parentOlCart.removeChild(parentOlCart.lastChild);
  });
};
/* Estava dentro da funcçao clearCart 
const totalp = document.querySelector('span.total-price');
const fi = totalp.firstElementChild;
totalp.removeChild(fi);
total = 0;
const creat = document.createElement('p');
creat.innerText = total;
totalp.appendChild(creat); */

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
};

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */
