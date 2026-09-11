class SiteHeader extends HTMLElement {
  connectedCallback() {
    const activePage = this.getAttribute('active-page') || '';
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; font-family:Inter,Arial,sans-serif; }
        * { box-sizing:border-box; }
        .header { position:sticky; top:0; z-index:100; height:68px; border-bottom:1px solid #e4eae7; background:rgba(255,255,255,.95); backdrop-filter:blur(14px); }
        .inner { width:min(1280px,100%); height:100%; margin:auto; padding:0 32px; display:flex; align-items:center; gap:28px; }
        .brand { flex:none; color:#0b5d47; font:700 italic 28px 'Playfair Display',Georgia,serif; letter-spacing:-1px; text-decoration:none; }
        .brand span { color:#ef7440; }
        .search { position:relative; width:285px; }
        .search::before { content:'⌕'; position:absolute; left:13px; top:7px; color:#84908b; font-size:20px; line-height:1; }
        .search input { width:100%; padding:10px 14px 10px 35px; border:1px solid transparent; border-radius:99px; outline:none; background:#f1f4f2; color:#24312b; font:12px Inter,Arial,sans-serif; }
        .search input:focus { border-color:#b7d0c7; background:#fff; }
        .links { display:flex; align-items:center; gap:22px; margin-left:auto; }
        .links a { color:#53615c; font-size:13px; font-weight:600; text-decoration:none; white-space:nowrap; }
        .links a:hover, .links a.active { color:#0b5d47; }
        .user { position:relative; }
        .user-button { display:flex; align-items:center; gap:8px; padding:4px 10px 4px 4px; border:1px solid #e4eae7; border-radius:99px; background:#fff; color:#26332e; font:600 12px Inter,Arial,sans-serif; cursor:pointer; }
        .user-button img { width:28px; height:28px; border-radius:50%; object-fit:cover; }
        .menu { display:none; position:absolute; top:calc(100% + 9px); right:0; width:205px; overflow:hidden; border:1px solid #e4eae7; border-radius:13px; background:#fff; box-shadow:0 12px 28px rgba(22,39,29,.15); }
        .user.open .menu { display:block; }
        .menu a { display:flex; align-items:center; gap:10px; padding:11px 16px; color:#45524c; font-size:12px; font-weight:600; text-decoration:none; transition:background .1s,color .1s; }
        .menu a:hover { background:#f2f6f4; color:#0b5d47; }
        .menu a + a { border-top:1px solid #f0f3f1; }
        .menu .menu-icon { width:16px; text-align:center; color:#8a9690; font-size:13px; }
        .menu a:hover .menu-icon { color:#0b5d47; }
        .menu .menu-sep { height:1px; margin:4px 0; background:#e4eae7; }
        .menu .logout { color:#c84842; }
        .menu .logout .menu-icon { color:#c84842; }
        @media (max-width:980px) { .links { display:none; } .search { margin-left:auto; } }
        @media (max-width:560px) { .inner { padding:0 14px; gap:12px; } .brand { font-size:25px; } .search { flex:1; width:auto; } .user-button span { display:none; } }
      </style>
      <nav class="header" aria-label="Điều hướng chính">
        <div class="inner">
          <a class="brand" href="index.html">LangThang<span>.</span></a>
          <label class="search"><input type="search" aria-label="Tìm kiếm" placeholder="Tìm kiếm địa điểm, bài viết..."></label>
          <div class="links">
            <a class="${activePage === 'home' ? 'active' : ''}" href="index.html">Khám phá</a>
            <a href="index.html#diadiem">Địa điểm</a>
            <a href="index.html#amthuc">Ẩm thực</a>
            <a href="index.html#hanhtrinh">Hành trình</a>
            <a href="index.html#blog">Blog</a>
          </div>
          <div class="user">
            <button class="user-button" type="button" aria-label="Mở menu tài khoản" aria-expanded="false">
              <img src="https://i.pravatar.cc/160?img=47" alt=""><span id="display-name">Minh Anh</span>
            </button>
            <div class="menu">
              <a href="profile.html"><span class="menu-icon"><i class="fa-regular fa-user"></i></span>Hồ sơ cá nhân</a>
              <a href="profile.html#reviews"><span class="menu-icon"><i class="fa-regular fa-star"></i></span>Bài đánh giá</a>
              <a href="profile.html#saved"><span class="menu-icon"><i class="fa-regular fa-bookmark"></i></span>Địa điểm đã lưu</a>
              <a href="profile.html#suggested"><span class="menu-icon"><i class="fa-regular fa-lightbulb"></i></span>Đề xuất của tôi</a>
              <div class="menu-sep"></div>
              <a class="logout" href="login.html"><span class="menu-icon"><i class="fa-solid fa-arrow-right-from-bracket"></i></span>Đăng xuất</a>
            </div>
          </div>
        </div>
      </nav>`;
    const user = this.shadowRoot.querySelector('.user');
    const button = this.shadowRoot.querySelector('.user-button');
    button.addEventListener('click', () => {
      user.classList.toggle('open');
      button.setAttribute('aria-expanded', user.classList.contains('open'));
    });
    document.addEventListener('click', (event) => {
      if (!this.contains(event.target)) { user.classList.remove('open'); button.setAttribute('aria-expanded', 'false'); }
    });
    const sharedName = document.getElementById('nav-name');
    if (sharedName) {
      const displayName = this.shadowRoot.getElementById('display-name');
      displayName.textContent = sharedName.textContent;
      new MutationObserver(() => { displayName.textContent = sharedName.textContent; }).observe(sharedName, { childList: true, characterData: true, subtree: true });
    }
  }
}
customElements.define('site-header', SiteHeader);
