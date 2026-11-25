let activeFilter='all', map=null, markers={};
const $=id=>document.getElementById(id);
function visibleSites(){const input=$('search');const q=input?input.value.trim().toLocaleLowerCase('vi'):'';return (window.sites||[]).filter(s=>(activeFilter==='all'||s.type===activeFilter)&&(`${s.name} ${s.address} ${s.category}`).toLocaleLowerCase('vi').includes(q));}
function updateMarkers(){if(!map)return;const ids=visibleSites().map(s=>s.id);Object.entries(markers).forEach(([id,m])=>m.getElement().style.display=ids.includes(id)?'flex':'none');}
function navigateToSiteFromMap(id){document.querySelectorAll('.page-panel').forEach(p=>p.classList.toggle('is-active',p.dataset.page==='sites'));const s=(window.sites||[]).find(x=>x.id===id);if(s)showSite(s);}
function showSite(s){const home=$('cards')?.closest('section');const detail=$('detail');if(!detail)return;home.style.display='none';detail.style.display='block';$('detailContent').innerHTML=`<div class="detail-hero"><span class="eyebrow">HỒ SƠ DI SẢN · ${s.category}</span><h1>${s.name}</h1><p>${s.address}</p><span class="detail-year">${s.year}</span></div><div class="detail-grid"><section class="detail-block"><span class="eyebrow">01 · DẤU MỐC</span><h2>Lịch sử hình thành</h2><p>${s.researchHistory||s.history}</p></section><section class="detail-block"><span class="eyebrow">02 · GIÁ TRỊ</span><h2>Giá trị lịch sử, văn hóa</h2><p>${s.researchValue||s.value}</p></section><section class="detail-block wide"><span class="eyebrow">03 · ĐỊNH VỊ</span><h2>Vị trí di tích</h2><p>${s.address}</p><div class="coords">Tọa độ: ${s.lat.toFixed(6)}° N, ${s.lng.toFixed(6)}° E</div><a class="detail-map-link" href="https://www.google.com/maps?q=${s.lat},${s.lng}" target="_blank" rel="noopener">Mở vị trí trên Google Maps ↗</a></section><section class="detail-block wide detail-placeholder"><span class="eyebrow">04 · TRẢI NGHIỆM SỐ</span><h2>Không gian trải nghiệm di tích</h2><div class="detail-feature-row"><div class="detail-placeholder-box">360°<small>KHU VỰC TRẢI NGHIỆM ẢO</small></div><div><h3>Trải nghiệm không gian 360°</h3><p>Khu vực giao diện dành cho hình ảnh toàn cảnh của di tích.</p></div></div></section><section class="detail-block wide detail-placeholder"><span class="eyebrow">05 · THUYẾT MINH</span><h2>Thuyết minh tự động bằng AI</h2><div class="audio-placeholder"><span class="audio-play">▶</span><div><strong>${s.name}</strong><small>KHU VỰC GIAO DIỆN TRÌNH PHÁT THUYẾT MINH</small></div><span class="audio-duration">--:--</span></div></section></div>`;window.scrollTo({top:0,behavior:'smooth'});}
function renderCards(){const cards=$('cards');if(!cards)return;const arr=visibleSites();$('count').textContent=`${arr.length} địa điểm`;cards.innerHTML=arr.map(s=>`<article class="site-card" tabindex="0" data-id="${s.id}"><div class="card-topline"><span>DI TÍCH 0${window.sites.indexOf(s)+1}</span><span class="card-arrow">↗</span></div><div class="card-category">${s.category}</div><h3>${s.name}</h3><p>${s.value.slice(0,145)}…</p><div class="card-bottom"><span>Khám phá hồ sơ</span><b>→</b></div></article>`).join('');cards.querySelectorAll('.site-card').forEach(el=>{el.onclick=()=>showSite(window.sites.find(s=>s.id===el.dataset.id));el.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')showSite(window.sites.find(s=>s.id===el.dataset.id));};});updateMarkers();}
if($('search'))$('search').addEventListener('input',renderCards);
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));renderCards();}));
if($('back'))$('back').onclick=()=>{const detail=$('detail');detail.style.display='none';$('cards').closest('section').style.display='block';window.scrollTo({top:0,behavior:'smooth'});};
const streetStyle='https://tiles.openfreemap.org/styles/liberty';const satelliteStyle={version:8,sources:{imagery:{type:'raster',tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],tileSize:256,attribution:'Tiles © Esri'},transportation:{type:'raster',tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}'],tileSize:256,attribution:'Esri World Transportation'},places:{type:'raster',tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],tileSize:256,attribution:'Esri Boundaries and Places'}},layers:[{id:'satellite-imagery',type:'raster',source:'imagery'},{id:'satellite-transportation',type:'raster',source:'transportation'},{id:'satellite-place-labels',type:'raster',source:'places'}]};
if($('map')&&window.maplibregl){map=new maplibregl.Map({container:'map',style:streetStyle,center:[107.523,16.546],zoom:12,attributionControl:true});map.addControl(new maplibregl.NavigationControl(),'top-right');map.on('load',()=>{window.sites.forEach(s=>{const el=document.createElement('div');el.className='heritage-marker-wrap';const label=document.createElement('div');label.className='heritage-marker-label';label.textContent=s.short||s.name;const pin=document.createElement('div');pin.className='heritage-marker';pin.innerHTML='<span></span>';el.append(label,pin);const popupContent=document.createElement('div');popupContent.className='heritage-popup';const title=document.createElement('strong');title.textContent=s.name;const category=document.createElement('p');category.textContent=s.category;const overview=document.createElement('p');overview.className='heritage-overview';overview.textContent=s.value;const link=document.createElement('a');link.className='popup-btn';link.textContent='Xem hồ sơ di tích →';link.href='#sites';link.addEventListener('click',e=>{e.preventDefault();navigateToSiteFromMap(s.id);});popupContent.append(title,category,overview,link);const popup=new maplibregl.Popup({offset:12,closeButton:true,maxWidth:'300px'}).setDOMContent(popupContent);markers[s.id]=new maplibregl.Marker({element:el,anchor:'bottom'}).setLngLat([s.lng,s.lat]).setPopup(popup).addTo(map);});});document.querySelectorAll('.map-mode').forEach(b=>b.addEventListener('click',()=>{map.setStyle(b.dataset.mapMode==='satellite'?satelliteStyle:streetStyle);document.querySelectorAll('.map-mode').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b?'true':'false');});}));}else if($('map'))$('map').innerHTML='<p class="map-error">Không tải được thư viện bản đồ. Hãy kiểm tra kết nối Internet.</p>';
if($('menuToggle'))$('menuToggle').addEventListener('click',()=>$('sidebar').classList.toggle('sidebar-open'));document.querySelectorAll('.side-nav a').forEach(a=>a.addEventListener('click',()=>$('sidebar')?.classList.remove('sidebar-open')));
if($('surveyForm'))$('surveyForm').addEventListener('submit',e=>{e.preventDefault();$('surveyNotice').textContent='Đây là giao diện minh họa, chưa gửi dữ liệu khảo sát.';});
renderCards();


/* SPA menu: one HTML file, nine separate views. Original map/search/marker code above stays intact. */
(() => {
  const titles = {
    home:"Trang chủ", sites:"Danh mục di tích", map:"Bản đồ số",
    images:"Thư viện hình ảnh", videos:"Video tư liệu",
    audio:"Thuyết minh AI", qr:"Mã QR",
    games:"Trò chơi lịch sử", survey:"Khảo sát trực tuyến", research:"Nội dung nghiên cứu"
  };
  function navigate(key, push=true) {
    if (!titles[key]) key="home";
    document.querySelectorAll(".page-panel").forEach(p =>
      p.classList.toggle("is-active", p.dataset.page===key)
    );
    document.querySelectorAll(".side-nav a").forEach(a =>
      a.classList.toggle("active", a.getAttribute("href")==="#"+key)
    );
    document.title=titles[key]+" | Bảo tàng lịch sử số Quảng Điền";
    document.getElementById("sidebar")?.classList.remove("sidebar-open");
    if (push && location.hash!=="#"+key) history.pushState({page:key},"","#"+key);
    window.scrollTo(0,0);
    if (key==="map" && map) {
      // Bản đồ được khởi tạo khi trang đang ẩn; resize sau khi trang hiện ra.
      requestAnimationFrame(() => {
        map.resize();
        setTimeout(() => {
          map.resize();
          updateMarkers();
        }, 250);
      });
    }
  }
  document.addEventListener("click", e => {
    const a=e.target.closest('a[href^="#"]');
    if (!a) return;
    const key=a.getAttribute("href").slice(1);
    if (!Object.prototype.hasOwnProperty.call(titles,key)) return;
    e.preventDefault();
    navigate(key);
  });
  window.addEventListener("popstate", () => navigate(location.hash.slice(1),false));
  window.addEventListener("hashchange", () => navigate(location.hash.slice(1),false));
  navigate(location.hash.slice(1)||"home",false);
})();
