console.log('Script is running');

function populateItems(items, containerId) {
  console.log('populateItems called with containerId:', containerId, 'and items:', items);
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.style.height = "600px";

    const img = document.createElement('img');
    img.src = item.image || 'tshirt.png';
    img.alt = item.title || 'Item';
    img.style.height = "280px";

    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    titleDiv.innerHTML = `${item.title}`;
    titleDiv.style.marginBottom = '20px';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'info';
    infoDiv.style.height = '280px';

    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    rowDiv.innerHTML = `<div class="price">$${item.price.toFixed(2)}</div><div class="sized">${item.sizes ? item.sizes.join(', ') : 'S,M,L,XL'}</div>`;

    const colorsDiv = document.createElement('div');
    colorsDiv.className = 'colors';
    colorsDiv.innerHTML = `Colors: <div class="row"></div>`;

    if (item.colors) {
      item.colors.forEach(color => {
        const circleDiv = document.createElement('div');
        circleDiv.className = 'circle';
        circleDiv.style.backgroundColor = color;
        colorsDiv.querySelector('.row').appendChild(circleDiv);
      });
    }

    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'row';

    if (item.rating) {
      ratingDiv.innerHTML = 
              `Rating: ${item.rating.rate} 
              <span class="rating-count">(${item.rating.count} reviews)</span>`;
    } else {
      ratingDiv.textContent = 'Rating: N/A';
    }

    const button = document.createElement('button');
    button.id = `addBtn-${item.id}`;
    button.className='cart';
    button.textContent = 'Add to Cart';

    // Add to Cart click event listener
    button.addEventListener('click', function() {
      addToCart(item.id);
    });

    infoDiv.appendChild(titleDiv);
    infoDiv.appendChild(rowDiv);
    infoDiv.appendChild(colorsDiv);
    infoDiv.appendChild(ratingDiv);
    itemDiv.appendChild(img);
    itemDiv.appendChild(infoDiv);
    itemDiv.appendChild(button);

    container.appendChild(itemDiv);
  });
}

function addToCart(itemId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart.some(cartItem => cartItem.itemId === itemId)) {
    cart.push({ itemId });
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Item added to cart:', itemId);
  } else {
    console.log('Item already in cart:', itemId);
  }
}

function getSelectedColors() {
  const selectedColors = [];
  document.querySelectorAll('#color-filters input[type="checkbox"]:checked').forEach(checkbox => {
    selectedColors.push(checkbox.value.toLowerCase());
  });
  console.log('Selected Colors:', selectedColors);
  return selectedColors;
}

function getSelectedSizes() {
  const selectedSizes = [];
  document.querySelectorAll('#size-filters input[type="checkbox"]:checked').forEach(checkbox => {
    selectedSizes.push(checkbox.value.toLowerCase());
  });
  console.log('Selected Sizes:', selectedSizes);
  return selectedSizes;
}

function getPriceRange() {
  const selectedRanges = [];
  document.querySelectorAll('section input[type="checkbox"]:checked').forEach(checkbox => {
    const range = checkbox.id;
    if (range) {
      selectedRanges.push(range);
    }
  });
  console.log('Selected Price Ranges:', selectedRanges);
  return selectedRanges;
}

const rangeInput = document.getElementById('range');
const rangeCount = document.getElementById('count');

rangeInput.addEventListener('input', function () {
  rangeCount.label = rangeInput.value;
});

function getSelectedRating() {
  console.log('Selected Rating:', rangeInput.value);
  return parseFloat(rangeInput.value);
}

let searching = document.getElementById('search');
searching.addEventListener('keyup', function () {
  console.log('Search query:', searching.value);
  updateFilter();
});
const Items = JSON.parse(localStorage.getItem("products")) || [];

function updateFilter() {
  console.log('updateFilter called');
  const allItems = JSON.parse(localStorage.getItem("products")) || [];
  console.log('All Items:', allItems);
  const selectedColors = getSelectedColors();
  const selectedSizes = getSelectedSizes();
  const selectedRating = getSelectedRating();
  const selectedRanges = getPriceRange();
  const activeCategory = document.querySelector('.filter.active')?.getAttribute('data-category') || 'all';
  const searchQuery = searching.value.toLowerCase();

  console.log('Active Category:', activeCategory);

  let filteredItems = allItems;

  if (activeCategory !== 'all') {
    filteredItems = filteredItems.filter(item => item.category === activeCategory);
  }

  console.log('Items after category filter:', filteredItems);

  if (selectedColors.length) {
    filteredItems = filteredItems.filter(item =>
      item.colors && item.colors.some(color => selectedColors.includes(color.toLowerCase()))
    );
  }

  console.log('Items after color filter:', filteredItems);

  if (selectedSizes.length) {
    filteredItems = filteredItems.filter(item =>
      item.sizes && item.sizes.some(size => selectedSizes.includes(size.toLowerCase()))
    );
  }

  console.log('Items after size filter:', filteredItems);

  if (selectedRating > 0) {
    filteredItems = filteredItems.filter(item => item.rating && item.rating.rate <= selectedRating);
  }

  console.log('Items after rating filter:', filteredItems);

  if (selectedRanges.length) {
    filteredItems = filteredItems.filter(item => {
      const itemPrice = item.price;
      return selectedRanges.some(range => {
        const [min, max] = range.split('-').map(val => parseFloat(val.replace('on', '')));
        return itemPrice >= (min || 0) && (max === undefined || itemPrice <= max);
      });
    });
  }

  console.log('Items after price filter:', filteredItems);

  if (searchQuery) {
    filteredItems = filteredItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery)
    );
  }

  console.log('Items after search filter:', filteredItems);

  document.querySelectorAll('.items').forEach(section => section.innerHTML = '');

  if (filteredItems.length) {
    populateItems(filteredItems.filter(item => item.category === "men's clothing"), 'men-items');
    populateItems(filteredItems.filter(item => item.category === "women's clothing"), 'womens-items');
    populateItems(filteredItems.filter(item => item.category === "jewelery"), 'jewels-items');
    populateItems(filteredItems.filter(item => item.category === "electronics"), 'elec-items');
  } else {
    document.querySelectorAll('.items').forEach(section => section.innerHTML = '<p>No items found</p>');
  }
}

document.querySelectorAll('#color-filters input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateFilter);
});

document.querySelectorAll('#size-filters input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateFilter);
});

document.querySelectorAll('section input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', updateFilter);
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');

    document.querySelectorAll('.filter').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    updateFilter();
  });
});

document.getElementById('range').addEventListener('input', updateFilter);

const currentUser = JSON.parse(localStorage.getItem('curruser') || "{}");

if (currentUser) {
  const colors = ["Red", "Blue", "Green", "Black", "White"];
  const sizes = ["S", "M", "L", "XL"];

  if (localStorage.getItem("products")) {
    updateFilter();
  } else {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        const newData = data.map(item => {
          item.colors = colors.slice(0, Math.floor(Math.random() * 5)+1);
          item.sizes = sizes.slice(0, Math.floor(Math.random() * 4) + 1);
          return item;
        });
        localStorage.setItem("products", JSON.stringify(newData));
        updateFilter();
      });
  }
} else {
  window.location.href = "./login.html";
}