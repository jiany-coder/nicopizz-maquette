(function(){
var ORDER_URL='https://www.nicopizz.com/menus';
var cart=[];try{cart=JSON.parse(localStorage.getItem('np_cart')||'[]')}catch(e){}
function save(){try{localStorage.setItem('np_cart',JSON.stringify(cart))}catch(e){}}
function eur(n){return n.toFixed(2).replace('.',',')+' €'}
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return[].slice.call((c||document).querySelectorAll(s))};
/* nav */
var nav=$('header.nav'),bg=$('.burger');if(bg)bg.onclick=function(){nav.classList.toggle('open')};
/* reveal */
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});$$('.reveal').forEach(function(el){io.observe(el)})}else $$('.reveal').forEach(function(el){el.classList.add('in')});
/* sizes */
$$('.sizes').forEach(function(box){var card=box.closest('.card'),pr=$('.price',card);$$('button',box).forEach(function(b){b.onclick=function(){$$('button',box).forEach(function(x){x.classList.remove('on')});b.classList.add('on');pr.textContent=eur(+b.dataset.p)}})});
/* cart */
function bump(){var c=$('.cartbtn');if(c){c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump')}}
function render(){
 var n=cart.reduce(function(a,l){return a+l.q},0),t=cart.reduce(function(a,l){return a+l.q*l.p},0);
 $$('.cartcount').forEach(function(e){e.textContent=n});
 $$('.carttotal').forEach(function(e){e.textContent=eur(t)});
 var box=$('#items');if(!box)return;
 if(!cart.length){box.innerHTML='<div class="empty">Votre panier est vide.<br>Choisissez une pizza, on s\'occupe du reste.</div>';return}
 box.innerHTML=cart.map(function(l,i){return '<div class="line"><div><b>'+l.n+'</b><br><small>'+(l.s||'')+'</small></div><div class="price">'+eur(l.p*l.q)+'</div><div class="qty"><button data-i="'+i+'" data-d="-1" aria-label="Retirer un">−</button><span>'+l.q+'</span><button data-i="'+i+'" data-d="1" aria-label="Ajouter un">+</button></div></div>'}).join('');
 $$('.qty button',box).forEach(function(b){b.onclick=function(){var l=cart[+b.dataset.i];l.q+=+b.dataset.d;if(l.q<1)cart.splice(+b.dataset.i,1);save();render()}})
}
function open(on){$('.drawer').classList.toggle('on',on);$('.drawer-bg').classList.toggle('on',on)}
$$('.cartbtn,.opencart').forEach(function(b){b.onclick=function(){open(true)}});
$$('.drawer .x,.drawer-bg').forEach(function(b){b.onclick=function(){open(false)}});
$$('[data-add]').forEach(function(b){b.onclick=function(){
 var card=b.closest('.card,.row'),name=b.dataset.add,size='',price=+b.dataset.price;
 var on=card&&$('.sizes .on',card);if(on){size=on.dataset.s;price=+on.dataset.p}
 var ex=cart.filter(function(l){return l.n===name&&l.s===size})[0];
 if(ex)ex.q++;else cart.push({n:name,s:size,p:price,q:1});
 save();render();bump();b.classList.add('ok');var o=b.textContent;if(b.classList.contains('add')){b.textContent='✓ Ajouté'}
 setTimeout(function(){b.classList.remove('ok');if(b.classList.contains('add'))b.textContent=o},900)}});
$$('.gocheckout').forEach(function(a){a.href=ORDER_URL});
render();
/* cats scroll */
$$('.cats .chip').forEach(function(c){c.onclick=function(e){$$('.cats .chip').forEach(function(x){x.classList.remove('on')});c.classList.add('on')}});
/* picker */
var ZONES=window.NP_ZONES||[];
var mode='livraison';
$$('.seg button').forEach(function(b){b.onclick=function(){$$('.seg button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');mode=b.dataset.m;upd()}});
var inp=$('#commune');function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function upd(){var out=$('#pickres');if(!out)return;
 if(mode==='emporter'){out.innerHTML='<b>À emporter</b> chez Nico Pizz Pavilly, 13 rue Delalandre. 1 pizza achetée = la 2ème à −50 %.';return}
 var q=inp?norm(inp.value):'';if(!q){out.innerHTML='Tapez votre commune ou code postal : on vous dit si on livre et quel minimum.';return}
 var m=ZONES.filter(function(z){return norm(z[0]).indexOf(q)>-1||z[1].indexOf(q)===0});
 if(!m.length){out.innerHTML='Commune non trouvée dans la liste. <b>La vérification officielle se fait à la commande.</b>';return}
 out.innerHTML=m.slice(0,4).map(function(z){return '<b>'+z[0]+'</b> ('+z[1]+') : livraison depuis Pavilly, minimum <b>'+z[2]+' €</b>'}).join('<br>')}
if(inp){inp.oninput=upd}upd();
})();
