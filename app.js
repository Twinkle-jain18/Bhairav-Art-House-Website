// ================================================================
// Bhairav Art House — Full SPA App with Router & All Pages
// ================================================================

class StoreApp {
    constructor() {
        const sd = window.StoreData || {};
        this.config     = this.load('bah_config',      sd.DEFAULT_CONFIG      || {});
        this.categories = this.load('bah_categories',  sd.DEFAULT_CATEGORIES  || []);
        this.products   = this.load('bah_products',    sd.DEFAULT_PRODUCTS    || []);
        this.cart       = this.load('bah_cart',        []);
        this.orders     = this.load('bah_orders',      []);
        this.faqData    = sd.FAQ_DATA  || [];
        this.policies   = sd.POLICIES  || {};

        this.activeCategory = 'all';
        this.searchQuery    = '';
        this.sortBy         = 'featured';
        this.cartStep       = 'items';
        this.selectedProduct = null;
        this.currentPage    = 'home';

        this.init();
    }

    // ── State ────────────────────────────────────────────────────
    load(key, fallback) {
        try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
        catch { return fallback; }
    }
    saveState(key, data) {
        try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
    }

    // ── Bootstrap ────────────────────────────────────────────────
    init() {
        this.bindGlobalEvents();
        this.bindCartEvents();
        this.router(location.hash.slice(1) || 'home');
        window.addEventListener('hashchange', () => this.router(location.hash.slice(1) || 'home'));
    }

    icons() {
        if (window.lucide) window.lucide.createIcons();
    }

    // ── Hash Router ──────────────────────────────────────────────
    router(hash = 'home') {
        const parts   = hash.split('/');
        const page    = parts[0] || 'home';
        const param   = parts[1] || '';
        this.currentPage = page;

        // Show/hide sections
        document.querySelectorAll('.page-section').forEach(s => {
            s.style.display = s.dataset.page === page ? '' : 'none';
        });

        // Update footer
        document.querySelector('.site-footer').style.display = '';

        // Active nav link
        document.querySelectorAll('.nav-link').forEach(l => {
            const lp = (l.getAttribute('href') || '').replace('#', '');
            l.classList.toggle('active', lp === page || (page === 'home' && lp === 'home'));
        });
        document.querySelectorAll('.mobile-nav-btn').forEach(b => {
            const lp = (b.getAttribute('href') || '').replace('#', '');
            b.classList.toggle('active', lp === page);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Render page content
        switch (page) {
            case 'home':      this.renderHome(); break;
            case 'shop':      this.renderShopPage(); break;
            case 'about':     this.renderAboutPage(); break;
            case 'contact':   this.renderContactPage(); break;
            case 'faq':       this.renderFaqPage(); break;
            case 'privacy':   this.renderPolicyPage('privacy'); break;
            case 'terms':     this.renderPolicyPage('terms'); break;
            case 'shipping':  this.renderPolicyPage('shipping'); break;
            case 'returns':   this.renderPolicyPage('returns'); break;
            case 'product':   this.renderProductDetailPage(param); break;
            case 'cart':      this.renderCartPage(); break;
            default:          location.hash = 'home';
        }

        this.icons();
    }

    // ── Global Events ────────────────────────────────────────────
    bindGlobalEvents() {
        // Admin trigger
        document.getElementById('trigger-admin-login')?.addEventListener('click', () =>
            window.adminPanel?.openLoginModal()
        );
        // Search Home
        document.getElementById('search-input-home')?.addEventListener('input', e => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.renderProductGrid('products-grid-home');
        });
        document.getElementById('sort-select-home')?.addEventListener('change', e => {
            this.sortBy = e.target.value;
            this.renderProductGrid('products-grid-home');
        });
        document.getElementById('reset-filters-home')?.addEventListener('click', () => {
            this.activeCategory = 'all';
            this.searchQuery = '';
            const inp = document.getElementById('search-input-home');
            if (inp) inp.value = '';
            this.renderCategories();
            this.renderProductGrid('products-grid-home');
        });

        // Search Shop
        document.getElementById('search-input-shop')?.addEventListener('input', e => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.renderProductGrid('products-grid-shop');
        });
        document.getElementById('sort-select-shop')?.addEventListener('change', e => {
            this.sortBy = e.target.value;
            this.renderProductGrid('products-grid-shop');
        });
        document.getElementById('reset-filters-shop')?.addEventListener('click', () => {
            this.activeCategory = 'all';
            this.searchQuery = '';
            const inp = document.getElementById('search-input-shop');
            if (inp) inp.value = '';
            this.renderCategoriesInto('categories-container-shop');
            this.renderProductGrid('products-grid-shop');
        });
    }

    // ── Cart Events ──────────────────────────────────────────────
    bindCartEvents() {
        document.querySelectorAll('.trigger-cart').forEach(b =>
            b.addEventListener('click', e => { e.preventDefault(); this.openCart(); })
        );
        document.getElementById('close-cart-btn')?.addEventListener('click', () => this.closeCart());
        document.getElementById('cart-drawer-overlay')?.addEventListener('click', e => {
            if (e.target === e.currentTarget) this.closeCart();
        });
        document.getElementById('whatsapp-order-form')?.addEventListener('submit', e => {
            e.preventDefault(); this.processWhatsAppOrder();
        });
    }

    openCart()  { document.getElementById('cart-drawer-overlay')?.classList.add('active'); document.body.style.overflow = 'hidden'; }
    closeCart() { document.getElementById('cart-drawer-overlay')?.classList.remove('active'); document.body.style.overflow = ''; }

    // ── HOME PAGE ────────────────────────────────────────────────
    renderHome() {
        this.renderCategories();
        this.renderProductGrid('products-grid-home');
        this.updateCartBadge();
    }

    renderShopPage() {
        this.renderCategoriesInto('categories-container-shop');
        this.renderProductGrid('products-grid-shop');
    }

    // ── Categories ───────────────────────────────────────────────
    renderCategories() {
        this.renderCategoriesInto('categories-container-home');
    }

    renderCategoriesInto(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        let html = `
            <button class="category-chip ${this.activeCategory === 'all' ? 'active' : ''}" data-cat="all">
                <i data-lucide="layout-grid" style="width:14px;height:14px;"></i>
                All Supplies <span class="chip-count">${this.products.length}</span>
            </button>`;
        this.categories.forEach(cat => {
            const count = this.products.filter(p => p.category === cat.id).length;
            html += `<button class="category-chip ${this.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                <i data-lucide="${cat.icon || 'tag'}" style="width:14px;height:14px;"></i>
                ${cat.name} <span class="chip-count">${count}</span>
            </button>`;
        });
        container.innerHTML = html;
        container.querySelectorAll('.category-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                this.activeCategory = chip.dataset.cat;
                this.renderCategoriesInto(containerId);
                const gridId = containerId.includes('shop') ? 'products-grid-shop' : 'products-grid-home';
                this.renderProductGrid(gridId);
                this.icons();
            });
        });
        this.icons();
    }

    getFiltered() {
        return this.products.filter(p => {
            const matchCat = this.activeCategory === 'all' || p.category === this.activeCategory;
            const matchQ   = !this.searchQuery ||
                p.name.toLowerCase().includes(this.searchQuery) ||
                (p.sku || '').toLowerCase().includes(this.searchQuery) ||
                (p.description || '').toLowerCase().includes(this.searchQuery);
            return matchCat && matchQ;
        }).sort((a, b) => {
            if (this.sortBy === 'price-low')  return a.price - b.price;
            if (this.sortBy === 'price-high') return b.price - a.price;
            if (this.sortBy === 'name-asc')   return a.name.localeCompare(b.name);
            if (this.sortBy === 'latest')     return b.id.localeCompare(a.id);
            return 0;
        });
    }

    renderProductGrid(gridId) {
        const grid  = document.getElementById(gridId);
        const empty = document.getElementById(gridId.replace('products-grid', 'products-empty'));
        if (!grid) return;
        const filtered = this.getFiltered();
        if (!filtered.length) {
            grid.style.display = 'none';
            if (empty) empty.style.display = '';
            return;
        }
        grid.style.display = 'grid';
        if (empty) empty.style.display = 'none';
        const fallback = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800';
        grid.innerHTML = filtered.map(p => {
            const hv  = p.variants?.length > 0;
            const cp  = hv ? p.variants[0].price : p.price;
            const cm  = hv ? p.variants[0].mrp   : p.mrp;
            const pct = cm > cp ? Math.round(((cm - cp) / cm) * 100) : 0;
            const sym = this.config.currencySymbol || '₹';
            return `
            <div class="product-card" data-id="${p.id}">
                <div class="product-img-wrap" onclick="storeApp.openProductPage('${p.id}')">
                    <img src="${p.image || fallback}" alt="${p.name}" class="product-img" loading="lazy"
                         onerror="this.src='${fallback}'" />
                    ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
                    <span class="product-stock-badge ${p.inStock ? 'stock-in' : 'stock-out'}">${p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    <div class="product-overlay-btn">
                        <span class="overlay-pill"><i data-lucide="eye" style="width:13px;height:13px;"></i> Quick View</span>
                    </div>
                </div>
                <div class="product-body">
                    <span class="product-cat-tag">${this.catName(p.category)}</span>
                    <h3 class="product-name" onclick="storeApp.openProductPage('${p.id}')">${p.name}</h3>
                    ${hv ? `<select class="variant-select" id="vs-${p.id}" onchange="storeApp.cardVariantChange('${p.id}',this.value)">
                        ${p.variants.map((v,i) => `<option value="${i}">${v.label} — ${sym}${v.price}</option>`).join('')}
                    </select>` : ''}
                    <div class="product-footer">
                        <div>
                            <div class="price-current" id="pc-${p.id}">${sym}${cp}</div>
                            ${cm > cp ? `<div style="display:flex;gap:.4rem;align-items:center;">
                                <span class="price-mrp">${sym}${cm}</span>
                                <span class="price-off">${pct}% off</span></div>` : ''}
                        </div>
                        <button class="btn-add-cart" onclick="storeApp.handleAddToCart('${p.id}')">
                            <i data-lucide="shopping-bag" style="width:14px;height:14px;"></i> Add
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');
        this.icons();
    }

    cardVariantChange(pid, idx) {
        const p = this.products.find(x => x.id === pid);
        if (!p?.variants) return;
        const v = p.variants[+idx];
        const el = document.getElementById(`pc-${pid}`);
        if (el && v) el.textContent = `${this.config.currencySymbol || '₹'}${v.price}`;
    }

    catName(catId) {
        return this.categories.find(c => c.id === catId)?.name || 'Art Supplies';
    }

    // ── Cart Logic ───────────────────────────────────────────────
    handleAddToCart(pid) {
        const p = this.products.find(x => x.id === pid);
        if (!p) return;
        const sel = document.getElementById(`vs-${pid}`);
        const variant = (sel && p.variants) ? p.variants[+sel.value] : (p.variants?.[0] || null);
        this.addToCart(p, variant);
    }

    addToCart(p, variant) {
        const sk  = variant?.sku   || p.sku;
        const lbl = variant?.label || 'Standard';
        const pr  = variant?.price || p.price;
        const idx = this.cart.findIndex(i => i.productId === p.id && i.variantSku === sk);
        if (idx > -1) this.cart[idx].quantity++;
        else this.cart.push({ productId: p.id, sku: p.sku, variantSku: sk, name: p.name, variantLabel: lbl, price: pr, image: p.image, quantity: 1 });
        this.saveState('bah_cart', this.cart);
        this.updateCartUI();
        this.showToast(`Added: ${p.name.substring(0, 28)}…`);
        this.openCart();
    }

    updateCartQty(idx, delta) {
        if (idx < 0 || idx >= this.cart.length) return;
        this.cart[idx].quantity += delta;
        if (this.cart[idx].quantity <= 0) this.cart.splice(idx, 1);
        this.saveState('bah_cart', this.cart);
        this.updateCartUI();
        if (this.currentPage === 'cart') this.renderCartPage();
    }

    removeFromCart(idx) {
        this.cart.splice(idx, 1);
        this.saveState('bah_cart', this.cart);
        this.updateCartUI();
        if (this.currentPage === 'cart') this.renderCartPage();
    }

    updateCartBadge() {
        const total = this.cart.reduce((s, i) => s + i.quantity, 0);
        document.querySelectorAll('.cart-count-badge').forEach(b => {
            b.textContent = total;
            b.style.display = total > 0 ? 'flex' : 'none';
        });
    }

    setCartStep(step) { this.cartStep = step; this.updateCartUI(); }

    updateCartUI() {
        this.updateCartBadge();
        const total  = this.cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const sym    = this.config.currencySymbol || '₹';
        const empty  = document.getElementById('cart-drawer-empty');
        const iView  = document.getElementById('cart-drawer-items-view');
        const cView  = document.getElementById('cart-drawer-checkout-view');
        const sub    = document.getElementById('cart-subtotal-display');
        const ctotal = document.getElementById('cart-checkout-total');
        const list   = document.getElementById('cart-items-list');
        if (sub)    sub.textContent    = `${sym}${total.toLocaleString('en-IN')}`;
        if (ctotal) ctotal.textContent = `${sym}${total.toLocaleString('en-IN')}`;
        if (!list)  return;
        if (!this.cart.length) {
            if (empty) empty.style.display = 'block';
            if (iView) iView.style.display = 'none';
            if (cView) cView.style.display = 'none';
        } else if (this.cartStep === 'checkout') {
            if (empty) empty.style.display = 'none';
            if (iView) iView.style.display = 'none';
            if (cView) { cView.style.display = 'flex'; cView.style.flexDirection = 'column'; }
        } else {
            if (empty) empty.style.display = 'none';
            if (iView) { iView.style.display = 'flex'; iView.style.flexDirection = 'column'; }
            if (cView) cView.style.display = 'none';
            const fb = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=300';
            list.innerHTML = this.cart.map((item, i) => `
                <div class="cart-item-card">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-thumb"
                         onerror="this.src='${fb}'" />
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-variant-pill">${item.variantLabel}</div>
                        <div class="cart-item-sku-text">SKU: ${item.variantSku}</div>
                        <div class="cart-item-bottom-row">
                            <div class="cart-qty-pill">
                                <button class="btn-qty" onclick="storeApp.updateCartQty(${i},-1)">−</button>
                                <span class="qty-number">${item.quantity}</span>
                                <button class="btn-qty" onclick="storeApp.updateCartQty(${i},1)">+</button>
                            </div>
                            <div class="cart-item-total-price">${sym}${(item.price*item.quantity).toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                    <button class="btn-item-delete" onclick="storeApp.removeFromCart(${i})" title="Remove">
                        <i data-lucide="trash-2" style="width:15px;height:15px;"></i>
                    </button>
                </div>`).join('');
        }
        this.icons();
    }

    // ── Cart Page (Full Page) ────────────────────────────────────
    renderCartPage() {
        const container = document.getElementById('cart-page-root');
        if (!container) return;
        const sym   = this.config.currencySymbol || '₹';
        const total = this.cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const fb    = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=300';
        if (!this.cart.length) {
            container.innerHTML = `
                <div class="page-hero">
                    <div class="container">
                        <span class="section-label">Your Selection</span>
                        <h1 class="page-title">Shopping Cart</h1>
                    </div>
                </div>
                <div class="container" style="padding:4rem 0;text-align:center;">
                    <div style="opacity:.35;margin-bottom:1rem;"><i data-lucide="shopping-cart" style="width:64px;height:64px;"></i></div>
                    <h3 style="font-family:var(--serif);font-size:1.4rem;margin-bottom:.5rem;font-weight:400;">Your cart is empty</h3>
                    <p style="color:var(--ink-faint);margin-bottom:1.5rem;font-weight:300;">Browse our curated art supplies catalogue and add your favourite items.</p>
                    <a href="#shop" class="btn-primary">Browse Catalogue</a>
                </div>`;
            this.icons(); return;
        }
        container.innerHTML = `
            <div class="page-hero">
                <div class="container">
                    <span class="section-label">Your Selection</span>
                    <h1 class="page-title">Shopping Cart</h1>
                </div>
            </div>
            <div class="container" style="padding:2.5rem 0 4rem;">
                <div class="cart-page-grid">
                    <div class="cart-page-items">
                        <h3 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:1.2rem;">Order Items (${this.cart.length})</h3>
                        ${this.cart.map((item, i) => `
                        <div class="cart-page-item">
                            <img src="${item.image}" class="cart-page-thumb" alt="${item.name}" onerror="this.src='${fb}'" />
                            <div class="cart-page-info">
                                <div class="cart-page-name">${item.name}</div>
                                <div class="cart-item-variant-pill">${item.variantLabel}</div>
                                <div class="cart-item-sku-text">SKU: ${item.variantSku}</div>
                            </div>
                            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.5rem;">
                                <div class="cart-qty-pill">
                                    <button class="btn-qty" onclick="storeApp.updateCartQty(${i},-1)">−</button>
                                    <span class="qty-number">${item.quantity}</span>
                                    <button class="btn-qty" onclick="storeApp.updateCartQty(${i},1)">+</button>
                                </div>
                                <div style="font-family:var(--serif);font-size:1.1rem;font-weight:600;color:var(--wc-deep);">${sym}${(item.price*item.quantity).toLocaleString('en-IN')}</div>
                                <button class="btn-item-delete" onclick="storeApp.removeFromCart(${i})" style="font-size:.78rem;display:flex;align-items:center;gap:.3rem;">
                                    <i data-lucide="trash-2" style="width:14px;height:14px;"></i> Remove
                                </button>
                            </div>
                        </div>`).join('')}
                        <div style="text-align:left;margin-top:1rem;">
                            <a href="#shop" style="font-size:.88rem;color:var(--wc-sienna);display:inline-flex;align-items:center;gap:.4rem;">
                                <i data-lucide="arrow-left" style="width:14px;height:14px;"></i> Continue Shopping
                            </a>
                        </div>
                    </div>
                    <div class="cart-page-summary">
                        <div class="cart-summary-card">
                            <h3 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:1.25rem;">Order Summary</h3>
                            <div style="display:flex;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid var(--border-soft);">
                                <span style="color:var(--ink-mid);font-size:.9rem;">Items (${this.cart.length})</span>
                                <span style="font-weight:500;">${sym}${total.toLocaleString('en-IN')}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid var(--border-soft);">
                                <span style="color:var(--ink-mid);font-size:.9rem;">Delivery</span>
                                <span style="color:#2E7D32;font-size:.88rem;font-weight:500;">${total >= 500 ? 'FREE (Within Hubballi)' : `${sym}30–50`}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;padding:1rem 0;margin-top:.25rem;">
                                <span style="font-family:var(--serif);font-size:1.2rem;font-weight:400;">Total</span>
                                <span style="font-family:var(--serif);font-size:1.5rem;font-weight:600;color:var(--wc-deep);">${sym}${total.toLocaleString('en-IN')}</span>
                            </div>
                            <div class="checkout-form-page" id="cart-page-checkout-form">
                                <h4 style="font-family:var(--serif);font-size:1rem;font-weight:400;margin-bottom:.9rem;color:var(--wc-deep);">Your Contact Details</h4>
                                <form id="cart-page-wa-form">
                                    <div class="form-group">
                                        <label class="form-label">Full Name *</label>
                                        <input type="text" id="cp-name" class="form-input" placeholder="Your name" required />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">WhatsApp Number *</label>
                                        <input type="tel" id="cp-phone" class="form-input" placeholder="10-digit mobile number" required />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Delivery Address / Area</label>
                                        <input type="text" id="cp-area" class="form-input" placeholder="e.g. Vidyanagar, Hubballi" />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Special Instructions</label>
                                        <textarea id="cp-notes" class="form-textarea" placeholder="Any notes or special requests…"></textarea>
                                    </div>
                                    <button type="submit" class="btn-whatsapp" style="width:100%;padding:.9rem;font-size:.95rem;border-radius:var(--r-md);">
                                        <i data-lucide="message-circle" style="width:18px;height:18px;"></i> PLACE ORDER ON WHATSAPP
                                    </button>
                                </form>
                            </div>
                            <div style="margin-top:.9rem;padding:.75rem;background:rgba(46,125,50,.06);border-radius:var(--r-md);font-size:.78rem;color:var(--ink-mid);text-align:center;">
                                <i data-lucide="shield-check" style="width:14px;height:14px;vertical-align:middle;color:#2E7D32;"></i>
                                &nbsp;No online payment needed. Pay only on delivery.
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        document.getElementById('cart-page-wa-form')?.addEventListener('submit', e => {
            e.preventDefault();
            this.processCartPageOrder();
        });
        this.icons();
    }

    processCartPageOrder() {
        const name  = document.getElementById('cp-name')?.value.trim();
        const phone = document.getElementById('cp-phone')?.value.trim();
        const area  = document.getElementById('cp-area')?.value.trim();
        const notes = document.getElementById('cp-notes')?.value.trim();
        if (!name || !phone) { alert('Please enter your name and WhatsApp number.'); return; }
        this._sendWhatsApp({ name, phone, area, notes });
    }

    processWhatsAppOrder() {
        const name  = document.getElementById('cust-name')?.value.trim();
        const phone = document.getElementById('cust-phone')?.value.trim();
        const area  = document.getElementById('cust-area')?.value.trim();
        const notes = document.getElementById('cust-notes')?.value.trim();
        if (!name || !phone) { alert('Please enter your name and WhatsApp number.'); return; }
        this._sendWhatsApp({ name, phone, area, notes });
        this.closeCart();
    }

    _sendWhatsApp({ name, phone, area, notes }) {
        if (!this.cart.length) { this.showToast('Your cart is empty!'); return; }
        const sym   = this.config.currencySymbol || '₹';
        const total = this.cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const orderId = `ORD-${Date.now().toString().slice(-6)}`;

        // Save order locally
        const order = { id: orderId, timestamp: new Date().toISOString(),
            customer: { name, phone, area, notes },
            items: JSON.parse(JSON.stringify(this.cart)),
            subtotal: total, status: 'new' };
        this.orders.unshift(order);
        this.saveState('bah_orders', this.orders);

        // Build WhatsApp message
        let msg = `🎨 *NEW ORDER — Bhairav Art House*\n`;
        msg += `📦 *Order ID:* ${orderId}\n`;
        msg += `──────────────────────\n`;
        msg += `👤 *Customer:* ${name}\n`;
        msg += `📞 *WhatsApp:* ${phone}\n`;
        if (area)  msg += `📍 *Address:* ${area}\n`;
        if (notes) msg += `📝 *Notes:* ${notes}\n`;
        msg += `──────────────────────\n`;
        msg += `🛒 *ITEMS ORDERED:*\n\n`;
        this.cart.forEach((it, i) => {
            msg += `${i+1}. *${it.name}*\n`;
            msg += `   └ ${it.variantLabel} (${it.variantSku})\n`;
            msg += `   └ Qty: ${it.quantity} × ${sym}${it.price} = *${sym}${(it.price*it.quantity).toLocaleString('en-IN')}*\n\n`;
        });
        msg += `──────────────────────\n`;
        msg += `💰 *TOTAL: ${sym}${total.toLocaleString('en-IN')}*\n`;
        msg += `──────────────────────\n`;
        msg += `_Please confirm availability & delivery charges. Thank you!_`;

        const wa = (this.config.whatsappNumber || '919876543210').replace(/\D/g, '');
        window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');
        this.showToast('Order sent to WhatsApp!');
    }

    // ── Product Detail Page ───────────────────────────────────────
    openProductPage(pid) {
        location.hash = `product/${pid}`;
    }

    renderProductDetailPage(pid) {
        const container = document.getElementById('product-detail-page-root');
        if (!container) return;
        const p   = this.products.find(x => x.id === pid);
        const sym = this.config.currencySymbol || '₹';
        const fb  = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800';
        if (!p) {
            container.innerHTML = `<div class="container" style="padding:4rem 0;text-align:center;">
                <h3 style="font-family:var(--serif);font-size:1.4rem;font-weight:400;margin-bottom:1rem;">Product not found</h3>
                <a href="#shop" class="btn-primary">Browse Catalogue</a></div>`;
            this.icons(); return;
        }
        const hv  = p.variants?.length > 0;
        const cp  = hv ? p.variants[0].price : p.price;
        const cm  = hv ? p.variants[0].mrp   : p.mrp;
        const pct = cm > cp ? Math.round(((cm - cp) / cm) * 100) : 0;

        container.innerHTML = `
            <div class="page-hero" style="padding:2rem 0 1.5rem;">
                <div class="container">
                    <nav style="font-size:.82rem;color:var(--ink-faint);margin-bottom:.5rem;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;">
                        <a href="#home" style="color:var(--wc-sienna);">Home</a> /
                        <a href="#shop" style="color:var(--wc-sienna);">Catalogue</a> /
                        <span>${p.name.substring(0,40)}…</span>
                    </nav>
                </div>
            </div>
            <div class="container" style="padding:1.5rem 0 4rem;">
                <div class="product-detail-full-grid">
                    <!-- Gallery -->
                    <div class="detail-gallery-col">
                        <div class="detail-main-img-wrap">
                            <img src="${p.image || fb}" alt="${p.name}" id="detail-page-main-img"
                                 style="width:100%;height:420px;object-fit:cover;border-radius:var(--r-lg);border:1px solid var(--border-soft);background:var(--wc-blush);"
                                 onerror="this.src='${fb}'" />
                        </div>
                        ${p.gallery?.length > 1 ? `<div style="display:flex;gap:.65rem;margin-top:.75rem;overflow-x:auto;">
                            ${p.gallery.map(img => `<img src="${img}" onclick="document.getElementById('detail-page-main-img').src='${img}'"
                                style="width:72px;height:72px;object-fit:cover;border-radius:var(--r-sm);cursor:pointer;border:1px solid var(--border-soft);flex-shrink:0;"
                                onerror="this.src='${fb}'" />`).join('')}</div>` : ''}
                    </div>
                    <!-- Info -->
                    <div class="detail-info-col">
                        <span class="section-label">${this.catName(p.category)}</span>
                        <h1 style="font-family:var(--serif);font-size:1.85rem;font-weight:400;color:var(--wc-deep);margin:.25rem 0 .5rem;line-height:1.2;">${p.name}</h1>
                        <div style="font-size:.8rem;color:var(--ink-faint);margin-bottom:1rem;">SKU: <strong id="dp-sku">${hv ? p.variants[0].sku : p.sku}</strong></div>

                        <div style="display:flex;align-items:baseline;gap:.85rem;margin-bottom:1.25rem;">
                            <span style="font-family:var(--serif);font-size:2rem;font-weight:600;color:var(--wc-deep);" id="dp-price">${sym}${cp}</span>
                            ${cm > cp ? `<span style="font-size:1rem;color:var(--ink-faint);text-decoration:line-through;" id="dp-mrp">${sym}${cm}</span>
                            <span style="font-size:.85rem;font-weight:500;color:#2E7D32;">${pct}% off</span>` : ''}
                        </div>

                        <span class="${p.inStock ? 'stock-in' : 'stock-out'} product-stock-badge" style="position:static;margin-bottom:1rem;display:inline-block;">
                            ${p.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                        </span>

                        ${hv ? `<div class="form-group" style="margin-bottom:1.25rem;">
                            <label class="form-label">Select Size / Variant:</label>
                            <select class="form-select" id="dp-variant" onchange="storeApp.dpVariantChange('${p.id}',this.value)">
                                ${p.variants.map((v,i) => `<option value="${i}">${v.label} — ${sym}${v.price}</option>`).join('')}
                            </select>
                        </div>` : ''}

                        <p style="font-size:.93rem;font-weight:300;color:var(--ink-mid);line-height:1.7;margin-bottom:1.5rem;">${p.description || ''}</p>

                        ${p.specs ? `<h4 style="font-family:var(--serif);font-size:1rem;font-weight:400;margin-bottom:.6rem;color:var(--wc-deep);">Specifications</h4>
                        <table style="width:100%;border-collapse:collapse;font-size:.85rem;margin-bottom:1.5rem;">
                            ${Object.entries(p.specs).map(([k,v]) => `<tr>
                                <td style="padding:.4rem .5rem;border-bottom:1px solid var(--border-soft);color:var(--ink-faint);width:40%;">${k}</td>
                                <td style="padding:.4rem .5rem;border-bottom:1px solid var(--border-soft);color:var(--ink);">${v}</td>
                            </tr>`).join('')}
                        </table>` : ''}

                        <div style="display:flex;gap:.85rem;flex-wrap:wrap;">
                            <button class="btn-primary" style="flex:1;min-width:160px;justify-content:center;" onclick="storeApp.dpAddToCart('${p.id}')">
                                <i data-lucide="shopping-bag" style="width:16px;height:16px;"></i> Add to Cart
                            </button>
                            <button class="btn-whatsapp" style="flex:1;min-width:160px;" onclick="storeApp.dpOrderNow('${p.id}')">
                                <i data-lucide="message-circle" style="width:16px;height:16px;"></i> Order Now
                            </button>
                        </div>

                        <div style="margin-top:1.25rem;padding:.85rem 1rem;background:rgba(46,125,50,.05);border-radius:var(--r-md);border:1px solid rgba(46,125,50,.15);">
                            <div style="display:flex;align-items:center;gap:.5rem;font-size:.82rem;color:#2E7D32;margin-bottom:.4rem;">
                                <i data-lucide="shield-check" style="width:15px;height:15px;"></i><strong>100% Genuine Product Guarantee</strong>
                            </div>
                            <div style="font-size:.78rem;color:var(--ink-faint);">Free delivery on orders ₹500+. No online payment required. Pay on delivery.</div>
                        </div>
                    </div>
                </div>

                <!-- Related Products -->
                <div style="margin-top:3.5rem;">
                    <h3 style="font-family:var(--serif);font-size:1.5rem;font-weight:400;margin-bottom:1.5rem;color:var(--wc-deep);">You May Also Like</h3>
                    <div class="products-grid" id="related-products-grid"></div>
                </div>
            </div>`;

        // Render related products
        const origCat = this.activeCategory;
        const origQ   = this.searchQuery;
        this.activeCategory = p.category;
        this.searchQuery    = '';
        const related = this.getFiltered().filter(x => x.id !== pid).slice(0, 4);
        this.activeCategory = origCat;
        this.searchQuery    = origQ;
        const relGrid = document.getElementById('related-products-grid');
        if (relGrid && related.length) {
            const fallback = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800';
            relGrid.innerHTML = related.map(rp => {
                const rhv = rp.variants?.length > 0;
                const rcp = rhv ? rp.variants[0].price : rp.price;
                return `<div class="product-card" onclick="storeApp.openProductPage('${rp.id}')" style="cursor:pointer;">
                    <div class="product-img-wrap">
                        <img src="${rp.image || fallback}" alt="${rp.name}" class="product-img" loading="lazy" onerror="this.src='${fallback}'" />
                        ${rp.badge ? `<span class="product-badge">${rp.badge}</span>` : ''}
                    </div>
                    <div class="product-body">
                        <span class="product-cat-tag">${this.catName(rp.category)}</span>
                        <h3 class="product-name">${rp.name}</h3>
                        <div class="product-footer">
                            <div class="price-current">${sym}${rcp}</div>
                            <button class="btn-add-cart" onclick="event.stopPropagation();storeApp.handleAddToCartById('${rp.id}')">
                                <i data-lucide="shopping-bag" style="width:14px;height:14px;"></i> Add
                            </button>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }
        this.icons();
    }

    handleAddToCartById(pid) {
        const p = this.products.find(x => x.id === pid);
        if (!p) return;
        const variant = p.variants?.[0] || null;
        this.addToCart(p, variant);
    }

    dpVariantChange(pid, idx) {
        const p = this.products.find(x => x.id === pid);
        if (!p?.variants) return;
        const v   = p.variants[+idx];
        const sym = this.config.currencySymbol || '₹';
        const pe  = document.getElementById('dp-price');
        const me  = document.getElementById('dp-mrp');
        const se  = document.getElementById('dp-sku');
        if (pe) pe.textContent = `${sym}${v.price}`;
        if (me) me.textContent = `${sym}${v.mrp}`;
        if (se) se.textContent = v.sku;
    }

    dpAddToCart(pid) {
        const p   = this.products.find(x => x.id === pid);
        const sel = document.getElementById('dp-variant');
        const v   = (sel && p?.variants) ? p.variants[+sel.value] : p?.variants?.[0] || null;
        if (p) this.addToCart(p, v);
    }

    dpOrderNow(pid) {
        this.dpAddToCart(pid);
        setTimeout(() => { location.hash = 'cart'; }, 300);
    }

    // ── ABOUT PAGE ───────────────────────────────────────────────
    renderAboutPage() {
        const container = document.getElementById('about-page-root');
        if (!container) return;
        container.innerHTML = `
            <div class="page-hero">
                <div class="container">
                    <span class="section-label">Our Story</span>
                    <h1 class="page-title">About Bhairav Art House</h1>
                    <p class="page-subtitle">Hubballi's most trusted destination for fine art materials since 2015.</p>
                </div>
            </div>
            <div class="container" style="padding:3rem 0 4rem;">
                <div class="about-detail-grid">
                    <div>
                        <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=900&auto=format&fit=crop"
                             alt="Bhairav Art House Store"
                             style="width:100%;height:380px;object-fit:cover;border-radius:var(--r-xl);box-shadow:var(--sh-hover);" />
                    </div>
                    <div>
                        <span class="section-label">Heritage & Passion</span>
                        <h2 style="font-family:var(--serif);font-size:2rem;font-weight:400;color:var(--wc-deep);margin:.35rem 0 1rem;">Crafting Artists Since ${this.config.foundedYear || '2015'}</h2>
                        <p style="color:var(--ink-mid);font-weight:300;line-height:1.75;margin-bottom:1rem;">
                            Founded with a passion for the arts, <strong style="color:var(--wc-umber);font-weight:500;">Bhairav Art House</strong> has been the
                            cornerstone of the art supply community in Hubballi-Dharwad for over a decade. We believe
                            that every artist — whether a school student picking up their first pencil or a seasoned
                            professional — deserves access to world-class materials.
                        </p>
                        <p style="color:var(--ink-mid);font-weight:300;line-height:1.75;margin-bottom:1.75rem;">
                            Our carefully curated catalogue features authentic products from globally renowned brands:
                            Camel Artist, Winsor & Newton, Faber-Castell, Sakura, Pebeo, Brustro, and many more.
                            Every product we stock is sourced directly from authorised distributors, ensuring 100%
                            genuineness and manufacturer warranty.
                        </p>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;margin-bottom:1.75rem;">
                            <div class="stat-pill"><div class="stat-num">500+</div><div class="stat-label">Art Products</div></div>
                            <div class="stat-pill"><div class="stat-num">10+</div><div class="stat-label">Years in Business</div></div>
                            <div class="stat-pill"><div class="stat-num">100%</div><div class="stat-label">Genuine Brands</div></div>
                        </div>
                        <div style="display:flex;gap:.85rem;flex-wrap:wrap;">
                            <a href="#contact" class="btn-primary">
                                <i data-lucide="map-pin" style="width:16px;height:16px;"></i> Visit Us
                            </a>
                            <a href="#shop" class="btn-secondary">
                                <i data-lucide="layout-grid" style="width:16px;height:16px;"></i> Browse Catalogue
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Values -->
                <div style="margin-top:4rem;">
                    <div style="text-align:center;margin-bottom:2.5rem;">
                        <span class="section-label">Why Choose Us</span>
                        <h2 class="section-title">Our Commitment to Artists</h2>
                    </div>
                    <div class="values-grid">
                        ${[
                            { icon:'shield-check', title:'100% Genuine Products', desc:'Every product is sourced from authorised distributors. We guarantee authenticity on every item we sell.' },
                            { icon:'message-circle', title:'WhatsApp Ordering', desc:'Order instantly on WhatsApp with no online payment required. Pay only on delivery — completely risk-free.' },
                            { icon:'truck', title:'Fast Local Delivery', desc:'Home delivery within Hubballi-Dharwad in 1–2 working days. Free delivery on orders above ₹500.' },
                            { icon:'users', title:'Expert Guidance', desc:'Our knowledgeable staff can recommend the right materials for your skill level, style, and budget.' },
                            { icon:'refresh-cw', title:'Hassle-Free Returns', desc:'Not satisfied? Return unused products within 7 days. No questions asked policy for eligible items.' },
                            { icon:'star', title:'All Skill Levels Welcome', desc:'From beginner-friendly student sets to professional artist-grade materials — we stock for everyone.' }
                        ].map(v => `
                            <div class="value-card">
                                <div style="width:48px;height:48px;border-radius:var(--r-md);background:linear-gradient(135deg,var(--wc-umber),var(--wc-sienna));color:#fff;display:flex;align-items:center;justify-content:center;margin-bottom:.85rem;">
                                    <i data-lucide="${v.icon}" style="width:22px;height:22px;"></i>
                                </div>
                                <h4 style="font-family:var(--serif);font-size:1.05rem;font-weight:400;margin-bottom:.4rem;">${v.title}</h4>
                                <p style="font-size:.85rem;font-weight:300;color:var(--ink-mid);line-height:1.6;">${v.desc}</p>
                            </div>`).join('')}
                    </div>
                </div>
            </div>`;
        this.icons();
    }

    // ── CONTACT PAGE ─────────────────────────────────────────────
    renderContactPage() {
        const container = document.getElementById('contact-page-root');
        if (!container) return;
        container.innerHTML = `
            <div class="page-hero">
                <div class="container">
                    <span class="section-label">Get in Touch</span>
                    <h1 class="page-title">Contact Us</h1>
                    <p class="page-subtitle">We'd love to hear from you. Reach us on WhatsApp, phone, or visit our store.</p>
                </div>
            </div>
            <div class="container" style="padding:3rem 0 4rem;">
                <div class="contact-page-grid">
                    <!-- Contact Info -->
                    <div>
                        <h3 style="font-family:var(--serif);font-size:1.4rem;font-weight:400;margin-bottom:1.5rem;">Store Information</h3>
                        ${[
                            { icon:'map-pin',       label:'Address',        val:'Bhairav Art House,<br>Opp. Station Road, Main Market,<br>Hubballi, Karnataka — 580020' },
                            { icon:'phone',         label:'Phone / WhatsApp', val:'+91 98765 43210' },
                            { icon:'mail',          label:'Email',           val:'contact@bhairavarthouse.com' },
                            { icon:'clock',         label:'Business Hours',  val:'Monday – Saturday: 10:00 AM – 8:00 PM<br>Sunday: Closed' },
                            { icon:'instagram',     label:'Instagram',       val:'<a href="https://instagram.com/bhairavarthouse" target="_blank" style="color:var(--wc-sienna);">@bhairavarthouse</a>' }
                        ].map(item => `
                            <div style="display:flex;gap:1rem;margin-bottom:1.35rem;">
                                <div style="width:40px;height:40px;border-radius:var(--r-md);background:rgba(184,107,86,.1);border:1px solid var(--border-soft);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--wc-sienna);">
                                    <i data-lucide="${item.icon}" style="width:17px;height:17px;"></i>
                                </div>
                                <div>
                                    <div style="font-size:.72rem;font-family:var(--caps);letter-spacing:.12em;color:var(--wc-sienna);text-transform:uppercase;margin-bottom:.2rem;">${item.label}</div>
                                    <div style="font-size:.9rem;color:var(--ink-mid);font-weight:300;line-height:1.6;">${item.val}</div>
                                </div>
                            </div>`).join('')}
                        <a href="https://wa.me/919876543210?text=Hello%20Bhairav%20Art%20House!" target="_blank" rel="noopener" class="btn-whatsapp" style="width:100%;justify-content:center;margin-top:.5rem;">
                            <i data-lucide="message-circle" style="width:17px;height:17px;"></i> WhatsApp Us Now
                        </a>
                    </div>

                    <!-- Enquiry Form -->
                    <div>
                        <div style="background:var(--glass-card);backdrop-filter:blur(14px);border:1px solid var(--border-soft);border-radius:var(--r-xl);padding:2rem;box-shadow:var(--sh-card);">
                            <h3 style="font-family:var(--serif);font-size:1.3rem;font-weight:400;margin-bottom:.35rem;">Send an Enquiry</h3>
                            <p style="font-size:.84rem;color:var(--ink-faint);margin-bottom:1.5rem;font-weight:300;">Fill in the form and we'll respond via WhatsApp within 2 hours.</p>
                            <form id="contact-enquiry-form">
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
                                    <div class="form-group">
                                        <label class="form-label">Full Name *</label>
                                        <input type="text" id="enq-name" class="form-input" placeholder="Your name" required />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">WhatsApp Number *</label>
                                        <input type="tel" id="enq-phone" class="form-input" placeholder="10-digit number" required />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Email Address</label>
                                    <input type="email" id="enq-email" class="form-input" placeholder="your@email.com" />
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Subject *</label>
                                    <select id="enq-subject" class="form-select" required>
                                        <option value="">Select subject…</option>
                                        <option>Product Enquiry</option>
                                        <option>Order Status</option>
                                        <option>Bulk / Wholesale Order</option>
                                        <option>Return / Exchange</option>
                                        <option>Custom Art Supply Request</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Your Message *</label>
                                    <textarea id="enq-message" class="form-textarea" rows="4" placeholder="Tell us about your enquiry…" required></textarea>
                                </div>
                                <button type="submit" class="btn-primary" style="width:100%;justify-content:center;border-radius:var(--r-md);padding:.82rem;">
                                    <i data-lucide="message-circle" style="width:16px;height:16px;"></i> Send via WhatsApp
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Map Embed Placeholder -->
                <div style="margin-top:3rem;border-radius:var(--r-xl);overflow:hidden;height:320px;border:1px solid var(--border-soft);box-shadow:var(--sh-card);">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3849.4!2d75.1244!3d15.3647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHubballi%20Station%20Road!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin"
                        width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                        title="Bhairav Art House Location"></iframe>
                </div>
            </div>`;

        document.getElementById('contact-enquiry-form')?.addEventListener('submit', e => {
            e.preventDefault();
            const name    = document.getElementById('enq-name')?.value.trim();
            const phone   = document.getElementById('enq-phone')?.value.trim();
            const subject = document.getElementById('enq-subject')?.value;
            const message = document.getElementById('enq-message')?.value.trim();
            if (!name || !phone || !message) { alert('Please fill in all required fields.'); return; }
            let msg = `📞 *ENQUIRY — Bhairav Art House*\n\n`;
            msg += `👤 *Name:* ${name}\n📱 *Phone:* ${phone}\n📋 *Subject:* ${subject}\n\n📝 *Message:*\n${message}`;
            const wa = (this.config.whatsappNumber || '919876543210').replace(/\D/g, '');
            window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');
            this.showToast('Enquiry sent to WhatsApp!');
        });
        this.icons();
    }

    // ── FAQ PAGE ─────────────────────────────────────────────────
    renderFaqPage() {
        const container = document.getElementById('faq-page-root');
        if (!container) return;
        const faqs = this.faqData;
        container.innerHTML = `
            <div class="page-hero">
                <div class="container">
                    <span class="section-label">Help Center</span>
                    <h1 class="page-title">Frequently Asked Questions</h1>
                    <p class="page-subtitle">Everything you need to know about shopping at Bhairav Art House.</p>
                </div>
            </div>
            <div class="container" style="padding:2.5rem 0 4rem;">
                ${faqs.map((section, si) => `
                    <div style="margin-bottom:2.5rem;">
                        <h3 style="font-family:var(--serif);font-size:1.35rem;font-weight:400;color:var(--wc-deep);margin-bottom:1.1rem;padding-bottom:.6rem;border-bottom:2px solid rgba(184,107,86,.2);">
                            ${section.category}
                        </h3>
                        <div class="faq-list">
                            ${section.items.map((faq, fi) => `
                                <div class="faq-item" id="faq-${si}-${fi}">
                                    <button class="faq-q" onclick="storeApp.toggleFaq('faq-${si}-${fi}')">
                                        <span>${faq.q}</span>
                                        <i data-lucide="chevron-down" style="width:18px;height:18px;flex-shrink:0;transition:transform .25s ease;" class="faq-chevron"></i>
                                    </button>
                                    <div class="faq-a">
                                        <p>${faq.a}</p>
                                    </div>
                                </div>`).join('')}
                        </div>
                    </div>`).join('')}
                <div style="text-align:center;margin-top:2rem;padding:2rem;background:var(--glass-card);border:1px solid var(--border-soft);border-radius:var(--r-xl);">
                    <h3 style="font-family:var(--serif);font-size:1.3rem;font-weight:400;margin-bottom:.5rem;">Still have questions?</h3>
                    <p style="font-size:.9rem;color:var(--ink-faint);margin-bottom:1.25rem;font-weight:300;">Our team is available on WhatsApp to help you with any queries.</p>
                    <a href="https://wa.me/919876543210" target="_blank" class="btn-whatsapp">
                        <i data-lucide="message-circle" style="width:16px;height:16px;"></i> Chat on WhatsApp
                    </a>
                </div>
            </div>`;
        this.icons();
    }

    toggleFaq(id) {
        const item = document.getElementById(id);
        if (!item) return;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    }

    // ── POLICY PAGES ─────────────────────────────────────────────
    renderPolicyPage(policyKey) {
        const map = {
            privacy: 'privacy-page-root',
            terms:   'terms-page-root',
            shipping:'shipping-page-root',
            returns: 'returns-page-root'
        };
        const container = document.getElementById(map[policyKey]);
        const policy    = this.policies[policyKey];
        if (!container || !policy) return;

        container.innerHTML = `
            <div class="page-hero">
                <div class="container">
                    <span class="section-label">Legal</span>
                    <h1 class="page-title">${policy.title}</h1>
                    <p class="page-subtitle">Last updated: ${policy.lastUpdated}</p>
                </div>
            </div>
            <div class="container" style="padding:2.5rem 0 4rem;">
                <div class="policy-content-wrap">
                    <div style="background:rgba(201,164,75,.06);border:1px solid rgba(201,164,75,.25);border-radius:var(--r-md);padding:.9rem 1.25rem;margin-bottom:2rem;font-size:.84rem;color:var(--ink-mid);font-weight:300;">
                        <strong style="color:var(--wc-umber);font-weight:500;">Last Updated:</strong> ${policy.lastUpdated} &nbsp;·&nbsp;
                        If you have any questions about this policy, please <a href="#contact" style="color:var(--wc-sienna);">contact us</a>.
                    </div>
                    ${policy.content.map(section => `
                        <div class="policy-section">
                            <h3>${section.heading}</h3>
                            <p>${section.body}</p>
                        </div>`).join('')}
                </div>
            </div>`;
        this.icons();
    }

    // ── Toast ────────────────────────────────────────────────────
    showToast(msg) {
        let c = document.getElementById('toast-container');
        if (!c) { c = document.createElement('div'); c.id = 'toast-container'; c.className = 'toast-container'; document.body.appendChild(c); }
        const t = document.createElement('div'); t.className = 'toast';
        t.innerHTML = `<i data-lucide="check-circle" style="width:16px;height:16px;color:#2E7D32;flex-shrink:0;"></i><span>${msg}</span>`;
        c.appendChild(t); this.icons();
        setTimeout(() => t.remove(), 3200);
    }
}

// ── Bootstrap ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    window.storeApp = new StoreApp();
});
