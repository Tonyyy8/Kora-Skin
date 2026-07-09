
function relativeImage(path){return location.pathname.includes('/products/') ? '../'+path : path}
function productCard(p){return `<article class="product-card" data-category="${p.category}"><a class="product-open" href="${p.page}" aria-label="Open ${p.name}"><img src="${p.image}" alt="${p.name} packaging"></a><div class="product-body"><span class="pill">${p.categoryName}</span><a href="${p.page}" class="product-open"><h3>${p.name}</h3></a><p>${p.description}</p><div class="small">${p.size} · ${p.packaging}</div><div class="product-row"><span class="price">$${p.price}</span><button class="mini-btn" data-add="${p.slug}">Add to cart</button></div></div></article>`}
function renderCatalogue(){const grid=document.querySelector('[data-product-grid]');if(!grid)return;grid.innerHTML=PRODUCTS.map(productCard).join('');const count=document.querySelector('[data-product-count]');const buttons=[...document.querySelectorAll('[data-filter]')];function apply(cat){buttons.forEach(b=>b.classList.toggle('active',b.dataset.filter===cat));let visible=0;document.querySelectorAll('.product-card').forEach(card=>{const show=cat==='all'||card.dataset.category===cat;card.classList.toggle('hidden',!show);if(show)visible++});if(count)count.textContent=`${visible} product${visible===1?'':'s'} shown`}
buttons.forEach(btn=>btn.addEventListener('click',()=>apply(btn.dataset.filter)));apply('all');updateCartCount();document.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();addToCart(btn.dataset.add)}));}
function renderFeatured(){const grid=document.querySelector('[data-featured-grid]');if(!grid)return;const picks=['anti-aging-face-cream','retinol-face-serum','cellulose-face-mask','gold-bio-botox-eye-patches'].map(s=>PRODUCTS.find(p=>p.slug===s));grid.innerHTML=picks.map(productCard).join('');document.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();addToCart(btn.dataset.add)}));}
function renderCheckout(){const mount=document.querySelector('[data-checkout-items]');if(!mount)return;const cart=getCart();const rows=cart.map(item=>{const p=PRODUCTS.find(x=>x.slug===item.slug);if(!p)return '';return `<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div><strong>${p.name}</strong><div class="small">${p.size}</div><div class="small">$${p.price} each</div></div><div class="qty"><button aria-label="Decrease ${p.name}" onclick="changeQty('${p.slug}',-1)">−</button><strong>${item.qty}</strong><button aria-label="Increase ${p.name}" onclick="changeQty('${p.slug}',1)">+</button><button class="remove-btn" aria-label="Remove ${p.name}" onclick="removeFromCart('${p.slug}')">×</button></div></div>`}).join('');
mount.innerHTML=rows||'<p class="small">Your cart is empty. Go to the catalogue to add products.</p>';const subtotal=cart.reduce((sum,item)=>{const p=PRODUCTS.find(x=>x.slug===item.slug);return sum+(p?p.price*item.qty:0)},0);document.querySelectorAll('[data-subtotal]').forEach(el=>el.textContent='$'+subtotal.toFixed(2));document.querySelectorAll('[data-total]').forEach(el=>el.textContent='$'+subtotal.toFixed(2));updateCartCount();}
function setupForms(){document.querySelectorAll('form[data-demo-form]').forEach(form=>{form.addEventListener('submit',e=>{e.preventDefault();const note=form.querySelector('.form-note');if(note){note.style.display='block';note.textContent='Demo submitted. This form is ready to connect to your email or CRM.'}form.reset();});});const checkout=document.querySelector('form[data-checkout-form]');if(checkout){checkout.addEventListener('submit',e=>{e.preventDefault();localStorage.removeItem('koraCart');location.href='order-confirmation.html';});}}

function renderProductDetail(){
  const mount = document.querySelector('[data-product-detail]');
  if(!mount) return;
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const p = PRODUCTS.find(x => x.slug === slug);
  if(!p){
    document.title = 'Product not found | Kora Skin';
    mount.innerHTML = `<div class="breadcrumb"><a href="index.html">Home</a> / <a href="catalogue.html">Catalogue</a></div>
      <section class="glass-panel"><h1 style="font-family:var(--serif);font-weight:400">Product not found.</h1>
      <p class="lead">This product could not be found. Return to the catalogue to continue browsing.</p>
      <div class="actions"><a class="btn primary" href="catalogue.html">Back to catalogue</a></div></section>`;
    updateCartCount();
    return;
  }
  document.title = `${p.name} | Kora Skin`;
  const meta = document.querySelector('meta[name="description"]');
  if(meta) meta.setAttribute('content', p.description);
  const related = PRODUCTS.filter(x => x.category === p.category && x.slug !== p.slug).slice(0,3);
  mount.innerHTML = `<div class="breadcrumb"><a href="index.html">Home</a> / <a href="catalogue.html">Catalogue</a> / ${p.name}</div>
    <div class="product-detail-grid">
      <div class="product-visual"><img src="${p.image}" alt="${p.name} packaging"></div>
      <div class="product-info">
        <span class="pill">${p.categoryName}</span>
        <h1>${p.name}</h1>
        <p class="lead">${p.description}</p>
        <div class="meta"><span class="pill">${p.size}</span><span class="pill">${p.packaging}</span></div>
        <ul class="info-list">
          <li><span>Price</span><strong>$${p.price}</strong></li>
          <li><span>Category</span><strong>${p.categoryName}</strong></li>
          <li><span>Skin focus</span><strong>${p.skinFocus}</strong></li>
          <li><span>Packaging</span><strong>${p.packaging}</strong></li>
        </ul>
        <div class="actions">
          <button class="btn primary" data-add="${p.slug}">Add to cart</button>
          <a class="btn secondary" href="checkout.html">Go to checkout</a>
          <a class="btn secondary" href="catalogue.html">Back to catalogue</a>
          <a class="btn secondary" href="index.html#contact">Product inquiry</a>
        </div>
      </div>
    </div>
    <section>
      <div class="section-head"><h2>Same category.</h2><p>Explore more products in ${p.categoryName}.</p></div>
      <div class="actions">${related.map(x => `<a class="btn secondary" href="${x.page}">${x.name}</a>`).join('')}</div>
    </section>`;
  updateCartCount();
  mount.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();addToCart(btn.dataset.add)}));
}

document.addEventListener('DOMContentLoaded',()=>{renderCatalogue();renderFeatured();renderCheckout();renderProductDetail();setupForms();});
