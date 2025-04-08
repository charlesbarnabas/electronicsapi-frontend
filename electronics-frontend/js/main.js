const API_URL = 'http://localhost:5000/products';

async function fetchProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();
  const container = document.getElementById('productList');

  if (container) {
    container.innerHTML = '';
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg shadow-md p-3 flex flex-col justify-between';
      card.innerHTML = `
        <img src="http://localhost:5000${p.image_url}" class="w-full h-48 object-cover rounded mb-2" alt="${p.name}">
        <div>
          <h3 class="text-lg font-semibold">${p.name}</h3>
          <p class="text-sm text-gray-500">${p.category}</p>
          <p class="text-blue-600 font-bold">Rp ${p.price.toLocaleString('id-ID')}</p>
        </div>
        <div class="mt-3 flex justify-end gap-2">
          <button onclick="window.location.href='edit-product.html?id=${p.id}'" class="text-sm bg-yellow-400 px-3 py-1 rounded">Edit</button>
          <button onclick="confirmDelete(${p.id})" class="text-sm bg-red-500 text-white px-3 py-1 rounded">Delete</button>
        </div>
      `;
      container.appendChild(card);
    });
  }
}

function searchProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  fetch(API_URL).then(res => res.json()).then(products => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
    const container = document.getElementById('productList');
    container.innerHTML = '';
    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-lg shadow-md p-3 flex flex-col justify-between';
      card.innerHTML = `
        <img src="http://localhost:5000${p.image_url}" class="w-full h-48 object-cover rounded mb-2" alt="${p.name}">
        <div>
          <h3 class="text-lg font-semibold">${p.name}</h3>
          <p class="text-sm text-gray-500">${p.category}</p>
          <p class="text-blue-600 font-bold">Rp ${p.price.toLocaleString('id-ID')}</p>
        </div>
        <div class="mt-3 flex justify-end gap-2">
          <button onclick="window.location.href='edit-product.html?id=${p.id}'" class="text-sm bg-yellow-400 px-3 py-1 rounded">Edit</button>
          <button onclick="confirmDelete(${p.id})" class="text-sm bg-red-500 text-white px-3 py-1 rounded">Delete</button>
        </div>
      `;
      container.appendChild(card);
    });
  });
}

function confirmDelete(id) {
  if (confirm("Apakah yakin ingin menghapus produk ini?")) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        alert("Produk berhasil dihapus");
        fetchProducts();
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.includes('index')) fetchProducts();

  if (path.includes('add-product')) {
    document.getElementById('addProductForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
  
      await fetch(API_URL, {
        method: 'POST',
        body: formData
      });
  
      alert('Produk berhasil ditambahkan!');
      window.location.href = 'index.html';
    });
  }

  if (path.includes('edit-product')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
  
    fetch(`${API_URL}/${id}`).then(res => res.json()).then(product => {
      document.getElementById('name').value = product.name;
      document.getElementById('category').value = product.category;
      document.getElementById('price').value = product.price;
      document.getElementById('currentImage').src = `http://localhost:5000${product.image_url}`;
    });
  
    document.getElementById('editProductForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
  
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: formData
      });
  
      alert('Produk berhasil diperbarui');
      window.location.href = 'index.html';
    });
  
    window.deleteProduct = function () {
      if (confirm("Yakin ingin menghapus produk ini?")) {
        fetch(`${API_URL}/${id}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(() => {
            alert("Produk berhasil dihapus");
            window.location.href = 'index.html';
          });
      }
    };
  }
});
