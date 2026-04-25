// Loader
window.addEventListener('load',()=>{
  setTimeout(()=>{
    const l=document.getElementById('loader');
    l.style.opacity='0';
    setTimeout(()=>l.style.display='none',500);
  },1000);
});

// Page switch
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

// Toast
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg||'✓ Added to cart!';
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

// Cart count
let count=4;
function addToCart(){
  count++;
  document.getElementById('cartBadge').textContent=count;
  showToast('🛒 Item added to cart!');
}

// Qty change
function changeQty(btn,dir){
  const wrap=btn.parentElement;
  const el=wrap.querySelector('.qty-num');
  let n=parseInt(el.textContent)+dir;
  if(n<1)n=1;
  el.textContent=n;
}

// Payment select
function selPay(el){
  document.querySelectorAll('.pay-opt').forEach(p=>p.classList.remove('sel'));
  el.classList.add('sel');
  el.querySelector('input').checked=true;
}

// Place order
function placeOrder(){
  showToast('🎉 Order placed successfully!');
  setTimeout(()=>showPage('tracking'),800);
}

// Show tracking
function showTrack(){
  document.getElementById('trackResult').style.display='block';
  document.getElementById('trackResult').style.animation='fadeIn 0.5s ease';
  setTimeout(()=>document.getElementById('trackResult').scrollIntoView({behavior:'smooth'}),100);
}

// Category pills
document.querySelectorAll('.cat-pill').forEach(p=>{
  p.addEventListener('click',()=>{
    document.querySelectorAll('.cat-pill').forEach(x=>x.classList.remove('active'));
    p.classList.add('active');
  });
});

// Scroll animations
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';}
  });
},{threshold:0.1});
document.querySelectorAll('.prod-card,.cat-card,.feature,.banner-card').forEach(el=>{
  el.style.opacity='0';el.style.transform='translateY(24px)';
  el.style.transition='opacity 0.5s ease, transform 0.5s ease';
  obs.observe(el);
});
