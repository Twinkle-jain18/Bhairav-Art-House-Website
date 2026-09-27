// ================================================================
// Bhairav Art House — Admin Panel with Order Management
// ================================================================

class AdminPanel {
    constructor() {
        this.isAuthenticated = false;
        this.editingProductId = null;
        this.activeTab = 'products';
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('trigger-admin-login')?.addEventListener('click', () => this.openLoginModal());
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        document.getElementById('admin-pin-form')?.addEventListener('submit', e => { e.preventDefault(); this.verifyPin(); });
        document.getElementById('admin-product-form')?.addEventListener('submit', e => { e.preventDefault(); this.saveProduct(); });
        document.getElementById('admin-category-form')?.addEventListener('submit', e => { e.preventDefault(); this.saveCategory(); });
        document.getElementById('admin-config-form')?.addEventListener('submit', e => { e.preventDefault(); this.saveConfig(); });
        document.getElementById('admin-export-json')?.addEventListener('click', () => this.exportCatalogueJSON());
        document.getElementById('admin-import-json')?.addEventListener('change', e => this.importCatalogueJSON(e));
        document.getElementById('admin-reset-default')?.addEventListener('click', () => this.resetToDefaults());
    }

    // ── Auth ─────────────────────────────────────────────────────
    openLoginModal() {
        if (this.isAuthenticated) { this.openDashboardModal(); return; }
        document.getElementById('admin-pin-modal')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    closeLoginModal() {
        document.getElementById('admin-pin-modal')?.classList.remove('active');
        document.body.style.overflow = '';
    }
    verifyPin() {
        const pin    = document.getElementById('admin-pin-input')?.value.trim();
        const cfgPin = window.storeApp?.config?.adminPin || '1234';
        if (pin === cfgPin) {
            this.isAuthenticated = true;
            this.closeLoginModal();
            this.openDashboardModal();
            document.getElementById('admin-pin-input').value = '';
        } else {
            alert('Incorrect PIN. Default admin PIN is 1234.');
        }
    }

    // ── Dashboard ────────────────────────────────────────────────
    openDashboardModal() {
        const modal = document.getElementById('admin-dashboard-modal');
        if (!modal) return;
        this.switchTab('products');
        this.populateCategorySelects();
        this.populateConfigForm();
        this.updateOrderBadge();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.lucide) window.lucide.createIcons();
    }
    closeDashboardModal() {
        document.getElementById('admin-dashboard-modal')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ── Tab Switcher ─────────────────────────────────────────────
    switchTab(tab) {
        this.activeTab = tab;
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        document.querySelectorAll('.admin-tab-panel').forEach(p => p.style.display = p.dataset.panel === tab ? '' : 'none');
        if (tab === 'products') this.renderProductsList();
        if (tab === 'orders')   this.renderOrdersList();
        if (tab === 'settings') this.populateConfigForm();
    }

    updateOrderBadge() {
        const orders = window.storeApp?.orders || [];
        const newCount = orders.filter(o => o.status === 'new').length;
        const badge = document.getElementById('admin-orders-badge');
        if (badge) { badge.textContent = newCount; badge.style.display = newCount > 0 ? 'flex' : 'none'; }
    }

    // ── Products Tab ─────────────────────────────────────────────
    renderProductsList() {
        const container = document.getElementById('admin-products-table-body');
        if (!container || !window.storeApp) return;
        container.innerHTML = window.storeApp.products.map(p => `
            <tr>
                <td><img src="${p.image}" style="width:44px;height:44px;object-fit:cover;border-radius:var(--r-sm);border:1px solid var(--border-soft);"
                         onerror="this.src='https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=100'" /></td>
                <td>
                    <div style="font-family:var(--serif);font-size:.9rem;color:var(--wc-deep);font-weight:400;">${p.name}</div>
                    <div style="font-size:.7rem;color:var(--ink-faint);margin-top:.1rem;">SKU: ${p.sku} · ${window.storeApp.catName(p.category)}</div>
                </td>
                <td style="font-family:var(--serif);font-size:.95rem;">
                    ₹${p.price}
                    ${p.mrp > p.price ? `<div style="font-size:.7rem;color:var(--ink-faint);text-decoration:line-through;">₹${p.mrp}</div>` : ''}
                </td>
                <td><span class="product-stock-badge ${p.inStock ? 'stock-in' : 'stock-out'}">${p.inStock ? 'In Stock' : 'Out of Stock'}</span></td>
                <td style="text-align:right;white-space:nowrap;">
                    <button onclick="adminPanel.editProduct('${p.id}')" style="color:var(--wc-umber);font-size:.82rem;font-weight:500;padding:.2rem .5rem;">Edit</button>
                    <button onclick="adminPanel.deleteProduct('${p.id}')" style="color:#C62828;font-size:.82rem;font-weight:500;padding:.2rem .5rem;">Delete</button>
                </td>
            </tr>`).join('');
    }

    editProduct(pid) {
        const p = window.storeApp.products.find(x => x.id === pid);
        if (!p) return;
        this.editingProductId = pid;
        document.getElementById('admin-prod-id').value    = p.id;
        document.getElementById('admin-prod-sku').value   = p.sku;
        document.getElementById('admin-prod-name').value  = p.name;
        document.getElementById('admin-prod-category').value = p.category;
        document.getElementById('admin-prod-price').value = p.price;
        document.getElementById('admin-prod-mrp').value   = p.mrp || '';
        document.getElementById('admin-prod-stock').value = p.inStock ? 'true' : 'false';
        document.getElementById('admin-prod-image').value = p.image || '';
        document.getElementById('admin-prod-badge').value = p.badge || '';
        document.getElementById('admin-prod-desc').value  = p.description || '';
        document.getElementById('admin-form-title').textContent  = 'Edit Product';
        document.getElementById('admin-submit-btn').textContent  = 'Update Product';
        this.switchTab('products');
    }

    resetProductForm() {
        this.editingProductId = null;
        document.getElementById('admin-product-form')?.reset();
        document.getElementById('admin-form-title').textContent = 'Add New Product';
        document.getElementById('admin-submit-btn').textContent = 'Save Product';
    }

    saveProduct() {
        const sku   = document.getElementById('admin-prod-sku').value.trim();
        const name  = document.getElementById('admin-prod-name').value.trim();
        const cat   = document.getElementById('admin-prod-category').value;
        const price = parseFloat(document.getElementById('admin-prod-price').value);
        const mrp   = parseFloat(document.getElementById('admin-prod-mrp').value) || price;
        const stock = document.getElementById('admin-prod-stock').value === 'true';
        const image = document.getElementById('admin-prod-image').value.trim() || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800';
        const badge = document.getElementById('admin-prod-badge').value.trim();
        const desc  = document.getElementById('admin-prod-desc').value.trim();

        if (!sku || !name || isNaN(price)) { alert('SKU, Name, and Price are required.'); return; }

        if (this.editingProductId) {
            const idx = window.storeApp.products.findIndex(p => p.id === this.editingProductId);
            if (idx > -1) window.storeApp.products[idx] = { ...window.storeApp.products[idx], sku, name, category:cat, price, mrp, inStock:stock, image, badge, description:desc };
        } else {
            window.storeApp.products.unshift({
                id: `BAH-PRD-${Date.now().toString().slice(-4)}`,
                sku, name, category:cat, price, mrp, inStock:stock, image, badge, description:desc,
                variants: [{ label:'Standard Pack', price, mrp, sku }],
                specs: { "Brand": "Bhairav Art House", "Quality": "Artist Grade" }
            });
        }

        window.storeApp.saveState('bah_products', window.storeApp.products);
        window.storeApp.renderCategories?.();
        window.storeApp.renderProductGrid?.('products-grid-home');
        this.renderProductsList();
        this.resetProductForm();
        window.storeApp.showToast('Product saved successfully!');
    }

    deleteProduct(pid) {
        if (!confirm('Delete this product permanently?')) return;
        window.storeApp.products = window.storeApp.products.filter(p => p.id !== pid);
        window.storeApp.saveState('bah_products', window.storeApp.products);
        window.storeApp.renderCategories?.();
        window.storeApp.renderProductGrid?.('products-grid-home');
        this.renderProductsList();
        window.storeApp.showToast('Product deleted.');
    }

    populateCategorySelects() {
        const sel = document.getElementById('admin-prod-category');
        if (!sel || !window.storeApp) return;
        sel.innerHTML = window.storeApp.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    saveCategory() {
        const name = document.getElementById('admin-new-cat-name')?.value.trim();
        const icon = document.getElementById('admin-new-cat-icon')?.value.trim() || 'tag';
        if (!name) { alert('Please enter a category name.'); return; }
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (window.storeApp.categories.some(c => c.id === id)) { alert('Category already exists.'); return; }
        window.storeApp.categories.push({ id, name, icon, count: 0 });
        window.storeApp.saveState('bah_categories', window.storeApp.categories);
        window.storeApp.renderCategories?.();
        this.populateCategorySelects();
        document.getElementById('admin-category-form')?.reset();
        window.storeApp.showToast(`Category "${name}" added!`);
    }

    // ── Orders Tab ───────────────────────────────────────────────
    renderOrdersList() {
        const container = document.getElementById('admin-orders-list');
        if (!container || !window.storeApp) return;
        const orders = window.storeApp.orders || [];

        if (!orders.length) {
            container.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--ink-faint);">
                <i data-lucide="inbox" style="width:48px;height:48px;opacity:.4;"></i>
                <p style="margin-top:.75rem;font-size:.9rem;">No orders placed yet. Orders submitted via WhatsApp will appear here.</p>
            </div>`;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        container.innerHTML = orders.map((order, idx) => {
            const date = new Date(order.timestamp);
            const dateStr = date.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
            const timeStr = date.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
            const statusColors = {
                new: '#1565C0', confirmed: '#2E7D32', dispatched: '#E65100', delivered: '#1B5E20', cancelled: '#C62828'
            };
            const statusBg = {
                new: 'rgba(21,101,192,.1)', confirmed: 'rgba(46,125,50,.1)', dispatched: 'rgba(230,81,0,.1)',
                delivered: 'rgba(27,94,32,.1)', cancelled: 'rgba(198,40,40,.08)'
            };
            const sym = window.storeApp.config?.currencySymbol || '₹';
            return `
            <div class="order-card" id="order-${order.id}">
                <div class="order-card-header">
                    <div>
                        <div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;">
                            <strong style="font-family:var(--serif);font-size:.95rem;color:var(--wc-deep);">${order.id}</strong>
                            <span style="font-size:.7rem;font-weight:500;padding:.15rem .5rem;border-radius:var(--r-max);
                                color:${statusColors[order.status]||'#333'};background:${statusBg[order.status]||'#eee'};">
                                ${order.status.toUpperCase()}
                            </span>
                        </div>
                        <div style="font-size:.75rem;color:var(--ink-faint);margin-top:.2rem;">${dateStr} at ${timeStr}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-family:var(--serif);font-size:1.15rem;font-weight:600;color:var(--wc-deep);">${sym}${order.subtotal.toLocaleString('en-IN')}</div>
                        <div style="font-size:.75rem;color:var(--ink-faint);">${order.items.length} item(s)</div>
                    </div>
                </div>
                <div class="order-card-body">
                    <div class="order-customer-info">
                        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem;">
                            <i data-lucide="user" style="width:14px;height:14px;color:var(--wc-sienna);"></i>
                            <span style="font-weight:500;font-size:.88rem;">${order.customer.name}</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem;">
                            <i data-lucide="phone" style="width:14px;height:14px;color:var(--wc-sienna);"></i>
                            <a href="tel:${order.customer.phone}" style="font-size:.84rem;color:var(--wc-sienna);">${order.customer.phone}</a>
                        </div>
                        ${order.customer.area ? `<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem;">
                            <i data-lucide="map-pin" style="width:14px;height:14px;color:var(--wc-sienna);"></i>
                            <span style="font-size:.82rem;color:var(--ink-mid);">${order.customer.area}</span>
                        </div>` : ''}
                        ${order.customer.notes ? `<div style="font-size:.78rem;color:var(--ink-faint);font-style:italic;">Notes: ${order.customer.notes}</div>` : ''}
                    </div>

                    <!-- Items -->
                    <div class="order-items-list">
                        ${order.items.map(item => `
                            <div style="display:flex;align-items:center;gap:.6rem;padding:.4rem 0;border-bottom:1px solid var(--border-soft);">
                                <img src="${item.image}" style="width:36px;height:36px;object-fit:cover;border-radius:var(--r-sm);flex-shrink:0;"
                                     onerror="this.src='https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=100'" />
                                <div style="flex:1;min-width:0;">
                                    <div style="font-size:.8rem;font-weight:400;color:var(--wc-deep);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
                                    <div style="font-size:.7rem;color:var(--ink-faint);">${item.variantLabel} × ${item.quantity}</div>
                                </div>
                                <div style="font-size:.82rem;font-weight:500;color:var(--wc-deep);white-space:nowrap;">${sym}${(item.price*item.quantity).toLocaleString('en-IN')}</div>
                            </div>`).join('')}
                    </div>

                    <!-- Actions -->
                    <div class="order-actions">
                        <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;">
                            <label style="font-size:.78rem;color:var(--ink-mid);font-weight:400;">Status:</label>
                            <select onchange="adminPanel.updateOrderStatus('${order.id}', this.value)"
                                style="font-size:.8rem;padding:.3rem .6rem;border:1px solid var(--border-soft);border-radius:var(--r-sm);background:#fff;color:var(--ink);">
                                ${['new','confirmed','dispatched','delivered','cancelled'].map(s =>
                                    `<option value="${s}" ${s === order.status ? 'selected' : ''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
                            <a href="https://wa.me/${order.customer.phone.replace(/\D/g,'')}?text=Hello%20${encodeURIComponent(order.customer.name)}%2C%20your%20order%20${order.id}%20has%20been%20confirmed%20by%20Bhairav%20Art%20House.%20We%20will%20deliver%20it%20soon%21"
                               target="_blank" class="btn-whatsapp" style="font-size:.76rem;padding:.3rem .75rem;">
                                <i data-lucide="message-circle" style="width:13px;height:13px;"></i> Confirm via WA
                            </a>
                            <button onclick="adminPanel.deleteOrder('${order.id}')"
                                style="font-size:.76rem;padding:.3rem .7rem;border:1px solid rgba(198,40,40,.3);border-radius:var(--r-max);color:#C62828;background:rgba(198,40,40,.05);">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    updateOrderStatus(orderId, newStatus) {
        const order = window.storeApp.orders.find(o => o.id === orderId);
        if (!order) return;
        order.status = newStatus;
        window.storeApp.saveState('bah_orders', window.storeApp.orders);
        this.updateOrderBadge();
        window.storeApp.showToast(`Order ${orderId} marked as ${newStatus}.`);
    }

    deleteOrder(orderId) {
        if (!confirm('Delete this order record permanently?')) return;
        window.storeApp.orders = window.storeApp.orders.filter(o => o.id !== orderId);
        window.storeApp.saveState('bah_orders', window.storeApp.orders);
        this.renderOrdersList();
        this.updateOrderBadge();
        window.storeApp.showToast('Order deleted.');
    }

    // ── Settings Tab ─────────────────────────────────────────────
    populateConfigForm() {
        const cfg = window.storeApp?.config || {};
        document.getElementById('admin-cfg-whatsapp').value  = cfg.whatsappNumber || '919876543210';
        document.getElementById('admin-cfg-phone').value     = cfg.phone || '';
        document.getElementById('admin-cfg-pin').value       = cfg.adminPin || '1234';
        document.getElementById('admin-cfg-location').value  = cfg.location || '';
        document.getElementById('admin-cfg-email').value     = cfg.email || '';
        document.getElementById('admin-cfg-instagram').value = cfg.instagram || '';
    }

    saveConfig() {
        if (!window.storeApp) return;
        const cfg = window.storeApp.config;
        cfg.whatsappNumber = document.getElementById('admin-cfg-whatsapp').value.trim() || cfg.whatsappNumber;
        cfg.phone          = document.getElementById('admin-cfg-phone').value.trim();
        cfg.adminPin       = document.getElementById('admin-cfg-pin').value.trim()     || '1234';
        cfg.location       = document.getElementById('admin-cfg-location').value.trim();
        cfg.email          = document.getElementById('admin-cfg-email').value.trim();
        cfg.instagram      = document.getElementById('admin-cfg-instagram').value.trim();
        window.storeApp.saveState('bah_config', cfg);
        window.storeApp.showToast('Store settings saved!');
    }

    // ── Export / Import ──────────────────────────────────────────
    exportCatalogueJSON() {
        const data = {
            config: window.storeApp.config,
            categories: window.storeApp.categories,
            products: window.storeApp.products,
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `bhairav-art-house-${new Date().toISOString().slice(0,10)}.json`;
        a.click(); URL.revokeObjectURL(url);
    }

    importCatalogueJSON(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (parsed.products && parsed.categories) {
                    window.storeApp.products   = parsed.products;
                    window.storeApp.categories = parsed.categories;
                    if (parsed.config) window.storeApp.config = parsed.config;
                    window.storeApp.saveState('bah_products',   parsed.products);
                    window.storeApp.saveState('bah_categories', parsed.categories);
                    if (parsed.config) window.storeApp.saveState('bah_config', parsed.config);
                    window.storeApp.renderCategories?.();
                    window.storeApp.renderProductGrid?.('products-grid-home');
                    this.renderProductsList();
                    alert('Catalogue imported successfully!');
                } else alert('Invalid JSON format.');
            } catch { alert('Could not parse JSON file.'); }
        };
        reader.readAsText(file);
    }

    resetToDefaults() {
        if (!confirm('Reset to factory defaults? All custom changes will be lost.')) return;
        ['bah_products','bah_categories','bah_config'].forEach(k => localStorage.removeItem(k));
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
