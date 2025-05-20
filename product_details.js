// Get the product ID from the URL
const queryParams = new URLSearchParams(window.location.search);
const productId = queryParams.get("id");

// Fetch products and find the one with matching ID
async function fetchProductDetails() {
  try {
    const response = await fetch("./products.json");
    const products = await response.json();
    const product = products.find((p) => p.id === parseInt(productId));
    
    if (product) {
      renderProductDetails(product);
    } else {
      document.getElementById("product-details").innerHTML = "<h3>Product not found</h3>";
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
    document.getElementById("product-details").innerHTML = "<h3>Error loading product details</h3>";
  }
}

function renderProductDetails(product) {
  const container = document.getElementById("product-details");
  container.innerHTML = `
    <div class="card mb-3" style="max-width: 800px; margin: auto;">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${product.imageUrl}" class="img-fluid rounded-start" alt="${product.Title}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${product.Title}</h5>
            <p class="card-text">${product.shortdescription}</p>
            <p class="card-text"><strong>Category:</strong> ${product.category}</p>
            <p class="card-text"><strong>Price:</strong> $${product.price}</p>
            <button class="btn btn-primary">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Fetch the product details when the page loads
fetchProductDetails();
