window.onload = function onload() { };

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  section.lastChild.addEventListener('click', () => {
    const ItemID = section.firstChild.textContent;
    fetch(`https://api.mercadolibre.com/items/${ItemID}`)
      .then((element) => element.json()).then((json) => {
        const { price: salePrice } = json;
        const newCartItem = createCartItemElement({ sku, name, salePrice });
        const theOl = document.querySelector('ol.cart__items');
        theOl.appendChild(newCartItem);
      });
  });
  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

// function cartItemClickListener(event) {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((jsonObject) => {
      jsonObject.results.forEach(({ title: name, id: sku, thumbnail: image }) => {
      const productItem = createProductItemElement({ sku, name, image });
      const items = document.querySelector('section.items');
      items.appendChild(productItem);
    });
    });
// }
