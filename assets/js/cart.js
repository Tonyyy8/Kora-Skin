
function getCart(){try{return JSON.parse(localStorage.getItem('koraCart')||'[]')}catch(e){return []}}
function saveCart(cart){localStorage.setItem('koraCart',JSON.stringify(cart));updateCartCount()}
function updateCartCount(){const count=getCart().reduce((sum,item)=>sum+item.qty,0);document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=count)}
function addToCart(slug,qty=1){const cart=getCart();const found=cart.find(i=>i.slug===slug);if(found){found.qty+=qty}else{cart.push({slug,qty})}saveCart(cart);const btn=document.querySelector(`[data-add="${slug}"]`);if(btn){const old=btn.textContent;btn.textContent='Added';setTimeout(()=>btn.textContent=old,950)}}
function changeQty(slug,delta){const cart=getCart();const item=cart.find(i=>i.slug===slug);if(!item)return;item.qty+=delta;if(item.qty<=0){saveCart(cart.filter(i=>i.slug!==slug))}else{saveCart(cart)}renderCheckout&&renderCheckout()}
function removeFromCart(slug){saveCart(getCart().filter(i=>i.slug!==slug));renderCheckout&&renderCheckout()}
document.addEventListener('DOMContentLoaded',()=>{updateCartCount();document.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();addToCart(btn.dataset.add)}));});
