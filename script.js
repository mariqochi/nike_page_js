const header = document.querySelector("header");
const productContainer = document.getElementById("products-container");
const paginationContainer = document.getElementById("pagination");
const searchInput = document.querySelector(".search-input");

let allProducts = [];
let filteredProducts = [];
let productPerPage = 6;
let currentPage = 1;

function handleScroll() {
  if (window.scrollY > 80) {
    header.classList.add("fixed-top", "bg-dark");
    header.classList.remove("bg-light", "py-3");
    document.body.classList.add("with-fixed-header");
    
  } else {
    header.classList.remove("fixed-top", "bg-dark");
    header.classList.add("bg-light", "py-3");
    document.body.classList.remove("with-fixed-header");
  }
}

window.addEventListener("scroll", handleScroll);




/*
const topHeader = document.querySelector(".top-header");
const bottomHeader = document.querySelector(".bottom-header");
const centerSide = document.querySelector(".center-side-bottom");

function handleScroll() {
    if (window.scrollY > 80) {
     
      header.style.position = "fixed";
      header.style.top = "0";

        header.style.width = "1440px";
        header.style.left = "50%";
        header.style.transform = "translateX(-50%)";

        header.style.zIndex = "1000";
  
      topHeader.style.backgroundColor = "black";
      bottomHeader.style.backgroundColor = "black";
        
      centerSide.style.backgroundColor = "black"; 
      document.querySelectorAll(".link, .separator").forEach(el => {
        el.style.color = "white";
      });
    } else {
      // Unfix 
      header.style.position = "";
      header.style.top = "";
      header.style.left = "";
      header.style.width = "";
      header.style.zIndex = "";
  
      // when go to start position change background colors
      topHeader.style.backgroundColor = "#f5f5f5";
      bottomHeader.style.backgroundColor = "white";
      centerSide.style.backgroundColor = "transparent";
      // also changing text colors
      document.querySelectorAll(".link").forEach(el => {
        el.style.color = "black";
      });
      document.querySelectorAll(".separator").forEach(el => {
        el.style.color = "gray";
      });
    }
  }
  
  window.addEventListener("scroll", handleScroll);
  */

async function fetchProducts() {
  try {
    const response = await fetch("./products.json");
    

    const data = await response.json();
    /*console.log("📦 Loaded data:", data);*/
    allProducts = data;
    filteredProducts = data; 
    renderPagination();
    renderProducts(currentPage); //I have added it
  } catch (error) {
    console.error("404 error");
    productContainer.innerHTML = "<div>404 ERROR</div>";
  }
}


fetchProducts(); 


function renderProducts(page) {
  productContainer.innerHTML = "";
  const startIndex = (page - 1) * productPerPage;
  const endIndex = startIndex + productPerPage;
  const currentProduct = filteredProducts.slice(startIndex, endIndex);


  console.log("📦 Rendering products on page:", page);
  console.log("👟 Products on this page:", currentProduct);
  

  if (currentProduct.length === 0) {
    productContainer.innerHTML = "<div>No products found.</div>";
    paginationContainer.innerHTML = "";
    return;
  }

  currentProduct.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "mb-4");
    card.innerHTML = `
            <div class="card border-0" style="width: 18rem; cursor: pointer;">
                <img src="${product.imageUrl}" class="card-img-top" alt="${product.Title}">
                <div class="card-body bg-white">
                    <p class="mb-1 fw-bold text-danger small">Just in</p>
                    <h6 class="mb-1 fw-bold text-dark">${product.Title}</h6>
                    <p class="mb-1 text-secondary small">${product.category}</p>
                    <p class="mb-1 text-secondary small">One color</p>
                    <p class="mb-0 fw-bold text-dark">$${product.price}</p>
                </div>
            </div>
        `;
    card.addEventListener("click", () => {
      window.location.href = `product_details.html?id=${product.id}`;
    });
    productContainer.appendChild(card);
  });
}




//  RenderPagination
function renderPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredProducts.length / productPerPage);
  
    // Create "Prev" button
    const prevItem = document.createElement("li");
    prevItem.classList.add("page-item");
    prevItem.innerHTML = `<a class="page-link" href="#" style="color: black; background-color: white;">Prev</a>`;
  
    // Disable "Prev" if on the first page
    if (currentPage === 1) {
      prevItem.classList.add("disabled");
      prevItem.querySelector("a").style.opacity = "0.5"; 
      prevItem.querySelector("a").style.pointerEvents = "none"; 
    }
  
    prevItem.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts(currentPage);
        renderPagination();
      }
    });
  
    paginationContainer.appendChild(prevItem);
  
  
    for (let i = 1; i <= totalPages; i++) {
      const listItem = document.createElement("li");
      listItem.classList.add("page-item");
      
      const link = document.createElement("a");
      link.classList.add("page-link");
      link.href = "#";
      link.textContent = i;
      link.style.color = "black"; 
      link.style.backgroundColor = "white"; 
  
     
      if (i === currentPage) {
        listItem.classList.add("active");
        link.style.color = "white"; 
        link.style.backgroundColor = "black";
        link.style.borderColor = "black";
      }
  
      link.addEventListener("click", () => {
        currentPage = i;
        renderProducts(currentPage);
        renderPagination();
      });
  
      listItem.appendChild(link);
      paginationContainer.appendChild(listItem);
    }
  

    const nextItem = document.createElement("li");
    nextItem.classList.add("page-item");
    nextItem.innerHTML = `<a class="page-link" href="#" style="color: black; background-color: white;">Next</a>`;
  
    if (currentPage === totalPages) {
      nextItem.classList.add("disabled");
      nextItem.querySelector("a").style.opacity = "0.5"; 
      nextItem.querySelector("a").style.pointerEvents = "none";
    }
  
    nextItem.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts(currentPage);
        renderPagination();
      }
    });
  
    paginationContainer.appendChild(nextItem);
  }
  


searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim().replace(/\s+/g, " ");

  filteredProducts = allProducts.filter((product) =>
    product.Title.toLowerCase().replace(/\s+/g, " ").includes(query)
  );

  currentPage = 1;
  renderProducts(currentPage);
  renderPagination();
});

fetchProducts();
