// ================================================================
// Bhairav Art House — Complete Data: Products, FAQ, Policies
// ================================================================

const DEFAULT_CONFIG = {
    storeName: "Bhairav Art House",
    tagline: "Fine Art Supplies & Professional Artist Materials",
    whatsappNumber: "919876543210",
    adminPin: "1234",
    currencySymbol: "₹",
    location: "Opp. Station Road, Main Market, Hubballi, Karnataka — 580020",
    phone: "+91 98765 43210",
    email: "contact@bhairavarthouse.com",
    instagram: "https://instagram.com/bhairavarthouse",
    facebook: "",
    gst: "29XXXXX1234X1ZX",
    foundedYear: "2015"
};

const DEFAULT_CATEGORIES = [
    { id: "acrylic-colours", name: "Acrylic Colours",      icon: "palette",        desc: "Fast-drying, rich pigment acrylic paints for canvas & wood." },
    { id: "poster-colours", name: "Poster Colours",        icon: "paintbrush-2",   desc: "Opaque, vibrant water-based colors for design & posters." },
    { id: "oil-colours",    name: "Oil Colours",           icon: "droplet",        desc: "Artist-grade slow-drying oil paints with intense brilliance." },
    { id: "water-colours",  name: "Water Colours",         icon: "waves",          desc: "Transparent, luminous watercolor pans and tube sets." },
    { id: "brushes",        name: "Brushes",               icon: "brush",          desc: "Synthetic & natural hair sable, hog, and filbert brushes." },
    { id: "canvas",         name: "Canvas",                icon: "square",         desc: "Stretched cotton & linen canvases, canvas boards & rolls." },
    { id: "drawing-materials", name: "Drawing Materials",  icon: "pencil",         desc: "Graphite pencils, charcoal sticks, pastels & sketchbooks." },
    { id: "painting-materials", name: "Painting Materials",icon: "layout",         desc: "Palettes, easels, solvents, mediums & varnishes." },
    { id: "art-tools",      name: "Art Tools",             icon: "scissors",       desc: "Palette knives, clay sculptors, brayers & cutting mats." },
    { id: "stationery",     name: "Stationery",            icon: "book-open",      desc: "Calligraphy pens, technical markers & premium journal paper." },
    { id: "other-supplies", name: "Other Art Supplies",    icon: "box",            desc: "Resin art, craft accessories & specialty pigments." }
];

const DEFAULT_PRODUCTS = [
    {
        id: "BAH-PRD-001", sku: "BAH-ACR-001",
        name: "Camel Artist Acrylic Colour Set - 12 Tubes (20ml)",
        category: "acrylic-colours", mrp: 650, price: 585,
        inStock: true, badge: "Best Seller",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop","https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop"],
        variants: [
            { label: "12 Tubes (20ml)", price: 585, mrp: 650, sku: "BAH-ACR-001-12" },
            { label: "18 Tubes (20ml)", price: 840, mrp: 950, sku: "BAH-ACR-001-18" },
            { label: "24 Tubes (20ml)", price: 1120, mrp: 1250, sku: "BAH-ACR-001-24" }
        ],
        description: "Professional grade high-pigment acrylic colours with outstanding lightfastness and brilliant coverage. Ideal for canvas, paper, wood, and fabric.",
        specs: { "Brand": "Camel Artist", "Finish": "Satin Gloss", "Drying Time": "15-30 Minutes", "Non-Toxic": "Yes (AP Certified)" }
    },
    {
        id: "BAH-PRD-002", sku: "BAH-ACR-002",
        name: "Winsor & Newton Heavy Body Acrylic - Titanium White 60ml",
        category: "acrylic-colours", mrp: 720, price: 680,
        inStock: true, badge: "Premium",
        image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop"],
        variants: [
            { label: "60ml Tube", price: 680, mrp: 720, sku: "BAH-ACR-002-60" },
            { label: "200ml Tube", price: 1850, mrp: 2000, sku: "BAH-ACR-002-200" }
        ],
        description: "Professional artists' heavy body acrylic formulated to deliver maximum opacity and intense brush stroke retention.",
        specs: { "Brand": "Winsor & Newton", "Color": "PW6 Titanium White", "Opacity": "Opaque", "Series": "Series 1" }
    },
    {
        id: "BAH-PRD-003", sku: "BAH-OIL-001",
        name: "Pebeo Huile d'Art Fine Oil Paints Set (12 x 12ml)",
        category: "oil-colours", mrp: 1450, price: 1290,
        inStock: true, badge: "Featured",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop"],
        variants: [
            { label: "12 Tubes (12ml)", price: 1290, mrp: 1450, sku: "BAH-OIL-001-12" },
            { label: "24 Tubes (12ml)", price: 2350, mrp: 2600, sku: "BAH-OIL-001-24" }
        ],
        description: "Smooth, buttery oil colours crafted in France. Offers high resistance to yellowing and rich depth of colour.",
        specs: { "Brand": "Pebeo France", "Medium": "Refined Linseed Oil", "Drying Time": "2-6 Days", "Finish": "Satin Gloss" }
    },
    {
        id: "BAH-PRD-004", sku: "BAH-WTR-001",
        name: "Cotman Watercolour Half Pan Pocket Box (12 Colors)",
        category: "water-colours", mrp: 1800, price: 1650,
        inStock: true, badge: "Must Have",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop"],
        variants: [
            { label: "12 Half Pans", price: 1650, mrp: 1800, sku: "BAH-WTR-001-12" },
            { label: "24 Half Pans", price: 2990, mrp: 3300, sku: "BAH-WTR-001-24" }
        ],
        description: "Compact travel watercolor box with integrated mixing palette and pocket brush. Excellent tinting strength.",
        specs: { "Brand": "Winsor & Newton Cotman", "Format": "Half Pans", "Includes": "Pocket Brush + Palette" }
    },
    {
        id: "BAH-PRD-005", sku: "BAH-BRS-001",
        name: "Brustro Synthetic Mop & Detail Brush Set (10 Pcs)",
        category: "brushes", mrp: 990, price: 850,
        inStock: true, badge: "Top Seller",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"],
        variants: [
            { label: "Set of 10 Brushes", price: 850, mrp: 990, sku: "BAH-BRS-001-10" },
            { label: "Set of 15 + Case", price: 1420, mrp: 1650, sku: "BAH-BRS-001-15" }
        ],
        description: "Precision synthetic hair brushes designed for watercolors, acrylics, and gouache. High spring back and sharp point retention.",
        specs: { "Hair": "Taklon Synthetic", "Ferrule": "Nickel-Plated Brass", "Handle": "Ergonomic Birch", "Suitable For": "Watercolor, Acrylic, Gouache" }
    },
    {
        id: "BAH-PRD-006", sku: "BAH-CVS-001",
        name: "Pre-Stretched Cotton Canvas 100% Duck — 12×16 inch",
        category: "canvas", mrp: 380, price: 320,
        inStock: true, badge: "Popular",
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop"],
        variants: [
            { label: "8×10 inch (Pack of 2)", price: 280, mrp: 340, sku: "BAH-CVS-8X10" },
            { label: "12×16 inch", price: 320, mrp: 380, sku: "BAH-CVS-12X16" },
            { label: "18×24 inch", price: 590, mrp: 680, sku: "BAH-CVS-18X24" },
            { label: "24×36 inch", price: 980, mrp: 1150, sku: "BAH-CVS-24X36" }
        ],
        description: "Triple-primed with acid-free acrylic gesso. 100% medium grain cotton duck stretched on seasoned pinewood bars.",
        specs: { "GSM": "380 GSM", "Priming": "Triple Acrylic Gesso", "Wood Frame": "Kiln Dried Pinewood" }
    },
    {
        id: "BAH-PRD-007", sku: "BAH-DRW-001",
        name: "Faber-Castell Pitt Graphite Matt Pencils (Set of 6)",
        category: "drawing-materials", mrp: 750, price: 675,
        inStock: true, badge: "New Arrival",
        image: "https://images.unsplash.com/photo-1585336261026-8f5786372969?q=80&w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1585336261026-8f5786372969?q=80&w=800&auto=format&fit=crop"],
        variants: [
            { label: "Set of 6 (2B–14B)", price: 675, mrp: 750, sku: "BAH-DRW-001-6" },
            { label: "Set of 11 + Eraser", price: 1290, mrp: 1450, sku: "BAH-DRW-001-11" }
        ],
        description: "Ultra-matt graphite pencils reducing light reflections on paper. Ideal for monochrome charcoal-like portraits.",
        specs: { "Brand": "Faber-Castell", "Hardness Range": "HB, 2B, 4B, 6B, 8B, 14B", "Feature": "Reflex-free matt layout" }
    },
    {
        id: "BAH-PRD-008", sku: "BAH-PNT-001",
        name: "Wooden Folding Tabletop Studio Artist Easel",
        category: "painting-materials", mrp: 1850, price: 1490,
        inStock: true, badge: "Craftsman Pick",
        image: "https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?q=80&w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?q=80&w=800&auto=format&fit=crop"],
        variants: [
            { label: "Tabletop Folding (H-Frame)", price: 1490, mrp: 1850, sku: "BAH-PNT-ESL-TBL" },
            { label: "Full Height Studio Easel (6ft)", price: 3400, mrp: 4100, sku: "BAH-PNT-ESL-STD" }
        ],
        description: "Crafted from seasoned oiled beechwood. Adjustable incline angles up to 90 degrees. Stable and lightweight.",
        specs: { "Material": "Natural Beechwood", "Max Canvas": "24 Inches (Tabletop)", "Foldable": "Yes", "Weight": "1.4 kg" }
    },
    {
        id: "BAH-PRD-009", sku: "BAH-PST-001",
        name: "Camel Student Poster Colour Set (15 Shades × 10ml)",
        category: "poster-colours", mrp: 260, price: 230,
        inStock: true, badge: "Value Pack",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop"],
        variants: [
            { label: "12 Shades (10ml)", price: 180, mrp: 200, sku: "BAH-PST-12" },
            { label: "15 Shades (10ml)", price: 230, mrp: 260, sku: "BAH-PST-15" }
        ],
        description: "Smooth matte opaque colors ideal for students, designers, and color mixing practice.",
        specs: { "Brand": "Camel Kokuyo", "Finish": "Velvety Matte", "Solubility": "Water Soluble" }
    },
    {
        id: "BAH-PRD-010", sku: "BAH-TL-001",
        name: "Stainless Steel Palette Knife Set (5 Pieces)",
        category: "art-tools", mrp: 450, price: 360,
        inStock: true, badge: "Essential",
        image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop"],
        variants: [{ label: "Set of 5 Blades", price: 360, mrp: 450, sku: "BAH-TL-001-5" }],
        description: "Flexible stainless steel blades with comfortable wooden handles for impasto and oil painting.",
        specs: { "Blade": "Flex Stainless Steel", "Handle": "Solid Hardwood", "Includes": "5 Unique Shapes" }
    },
    {
        id: "BAH-PRD-011", sku: "BAH-STN-001",
        name: "Sakura Pigma Micron Black Fineliner Set (6 Nibs)",
        category: "stationery", mrp: 720, price: 649,
        inStock: true, badge: "Top Rated",
        image: "https://images.unsplash.com/photo-1585336261026-8f5786372969?q=80&w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1585336261026-8f5786372969?q=80&w=800&auto=format&fit=crop"],
        variants: [
            { label: "Set of 6 (005–08)", price: 649, mrp: 720, sku: "BAH-STN-001-6" },
            { label: "Set of 8 Architectural", price: 890, mrp: 980, sku: "BAH-STN-001-8" }
        ],
        description: "Archival quality Pigma ink fineliners. Waterproof, fade-resistant, won't bleed through paper.",
        specs: { "Brand": "Sakura Japan", "Ink": "Archival Pigma Pigment", "Nibs": "005 (0.2mm) to 08 (0.5mm)", "Waterproof": "100%" }
    },
    {
        id: "BAH-PRD-012", sku: "BAH-OTH-001",
        name: "Crystal Clear Epoxy Resin & Hardener Kit (300g)",
        category: "other-supplies", mrp: 690, price: 590,
        inStock: true, badge: "Trending",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop"],
        variants: [
            { label: "300g Kit (2:1 Ratio)", price: 590, mrp: 690, sku: "BAH-OTH-300G" },
            { label: "750g Kit", price: 1190, mrp: 1350, sku: "BAH-OTH-750G" },
            { label: "1.5kg Studio Pack", price: 2150, mrp: 2490, sku: "BAH-OTH-1.5KG" }
        ],
        description: "High-clarity UV resistant epoxy casting resin for art coat, coasters, jewelry, and fluid pouring.",
        specs: { "Ratio": "2:1 by weight", "Cure Time": "24 Hours", "Feature": "Bubble Free & High Gloss", "UV": "Yellowing Resistant" }
    }
];

// ================================================================
// FAQ Data
// ================================================================
const FAQ_DATA = [
    {
        category: "🛒 Ordering & Payment",
        icon: "shopping-cart",
        items: [
            { q: "How do I place an order?", a: "Browse our product catalogue, add items to your cart, click 'Proceed to WhatsApp Checkout', fill in your name and phone number, and tap 'Send Order on WhatsApp'. Our team will confirm availability and delivery details within a few hours." },
            { q: "Do I need to pay in advance online?", a: "No — Bhairav Art House does not require any online or advance payment. You pay only at the time of delivery or when you collect from our store. This makes shopping 100% safe and risk-free." },
            { q: "What payment methods do you accept?", a: "We accept cash on delivery, UPI (Google Pay, PhonePe, Paytm), and bank transfers. Our team will share payment details via WhatsApp when confirming your order." },
            { q: "Can I order in bulk or wholesale quantities?", a: "Yes! We welcome bulk and institutional orders from schools, art colleges, and professional artists. Please WhatsApp us directly with your requirements for special pricing." },
            { q: "Is there a minimum order value?", a: "There is no minimum order value for store pickup. For home delivery within Hubballi, a minimum order value of ₹200 applies." }
        ]
    },
    {
        category: "🚚 Delivery & Shipping",
        icon: "truck",
        items: [
            { q: "Which areas do you deliver to?", a: "We currently offer home delivery within Hubballi-Dharwad and surrounding areas. Delivery to other Karnataka locations is available for larger orders. Please contact us for outstation delivery queries." },
            { q: "How long does delivery take?", a: "Orders within Hubballi are typically delivered within 1–2 working days after WhatsApp confirmation. Outstation orders may take 3–7 working days depending on courier availability." },
            { q: "What is the delivery charge?", a: "Delivery within Hubballi is ₹30–₹50 for orders below ₹500. Orders above ₹500 within Hubballi qualify for free delivery. Outstation charges vary by location and courier service." },
            { q: "Can I collect my order from your store?", a: "Absolutely! Store pickup is available during our business hours (10:00 AM – 8:00 PM, Monday to Saturday). There's no delivery charge for store pickups." },
            { q: "How will I know when my order is dispatched?", a: "Our team will update you via WhatsApp at each step — order confirmation, dispatch, and delivery. You can always reply to your WhatsApp order thread to check status." }
        ]
    },
    {
        category: "↩️ Returns & Refunds",
        icon: "rotate-ccw",
        items: [
            { q: "Can I return a product if I'm not satisfied?", a: "Yes, we accept returns within 7 days of delivery, provided the product is unused, in original packaging, and in resaleable condition. Consumable paints and opened tubes are not eligible for return." },
            { q: "What if my order arrives damaged?", a: "If you receive a damaged or defective product, please WhatsApp us within 24 hours of delivery with a photo of the damage. We will arrange a replacement or full refund at no extra cost." },
            { q: "How long does a refund take?", a: "Refunds are processed within 3–5 working days after we receive and inspect the returned item. UPI/bank transfer refunds are typically completed within 2 working days of approval." },
            { q: "Who pays for the return shipping?", a: "If the return is due to our error (wrong product, damaged item), we cover the return shipping cost. For other returns (change of mind), the customer bears the return courier charges." }
        ]
    },
    {
        category: "🎨 Products & Quality",
        icon: "palette",
        items: [
            { q: "Are all your products genuine/authentic?", a: "Yes, 100%. We source all our products directly from authorised distributors of brands like Camel, Winsor & Newton, Faber-Castell, Sakura, Pebeo, and others. Every product comes with manufacturer packaging and authenticity." },
            { q: "Do you stock products for beginners as well as professionals?", a: "We cater to all skill levels — from beginner-friendly Camel student sets to professional Winsor & Newton artist-grade paints. Our staff can help you choose the right product for your level and budget." },
            { q: "Can I request a specific product not listed in the catalogue?", a: "Yes! If you're looking for a specific brand, shade, or product not in our current catalogue, WhatsApp us and we will try our best to source it for you." },
            { q: "Do you provide product recommendations?", a: "Absolutely! Our knowledgeable team is happy to recommend products suited to your specific artwork style, medium, and budget. Just WhatsApp us or visit our store." },
            { q: "Are your art supplies safe for children?", a: "Most student-grade products (like Camel poster colours and pencil sets) are non-toxic and safe for children above 3 years. Always check the product label for age recommendations." }
        ]
    },
    {
        category: "🏪 About Our Store",
        icon: "store",
        items: [
            { q: "Where is your store located?", a: "Bhairav Art House is located opposite Station Road, Main Market, Hubballi, Karnataka — 580020. We are open Monday to Saturday, 10:00 AM to 8:00 PM." },
            { q: "Do you have a physical store I can visit?", a: "Yes! We warmly welcome you to visit our store. Our experienced staff will help you browse our full collection and select the right art materials in person." },
            { q: "How can I contact Bhairav Art House?", a: "You can reach us via WhatsApp at +91 98765 43210, call us directly, email us at contact@bhairavarthouse.com, or visit our store. We typically respond to WhatsApp messages within 2 hours." },
            { q: "Do you offer gift wrapping or gift sets?", a: "Yes! We can create custom gift sets and offer gift wrapping for art material sets. Perfect for birthdays, teacher gifts, or art student graduation gifts. Contact us via WhatsApp to arrange." }
        ]
    }
];

// ================================================================
// Policy Content
// ================================================================
const POLICIES = {
    privacy: {
        title: "Privacy Policy",
        lastUpdated: "September 2026",
        content: [
            { heading: "1. Information We Collect", body: "When you place an order via WhatsApp or use our contact form, we collect your name, WhatsApp/phone number, and delivery address. We do not collect sensitive financial information — all payments are handled offline at time of delivery." },
            { heading: "2. How We Use Your Information", body: "Your information is used solely to process and deliver your order, respond to enquiries, and send order updates via WhatsApp. We do not use your data for automated marketing without your consent." },
            { heading: "3. Data Sharing", body: "We do not sell, trade, or share your personal information with third parties. Your contact details are only shared with our delivery partners strictly for order fulfilment purposes." },
            { heading: "4. Data Storage", body: "Order information is stored securely within our WhatsApp Business account and internal records. No personal data is stored in third-party cloud platforms or sold to advertisers." },
            { heading: "5. WhatsApp Communication", body: "By placing an order via WhatsApp, you consent to receiving order confirmations, delivery updates, and occasional product offers from Bhairav Art House on WhatsApp. You may opt out by replying STOP at any time." },
            { heading: "6. Cookies", body: "Our website uses minimal browser local storage to remember your cart across sessions. No third-party cookies or tracking pixels are used." },
            { heading: "7. Your Rights", body: "You have the right to request deletion of your personal data from our records. To do so, contact us via WhatsApp or email at contact@bhairavarthouse.com." },
            { heading: "8. Children's Privacy", body: "Our services are not directed to children under 13. We do not knowingly collect personal information from minors." },
            { heading: "9. Policy Updates", body: "We may update this Privacy Policy from time to time. Changes will be reflected on this page with the updated date. Continued use of our website constitutes acceptance of the updated policy." },
            { heading: "10. Contact Us", body: "For any privacy-related questions or requests, please contact us at contact@bhairavarthouse.com or WhatsApp +91 98765 43210." }
        ]
    },
    terms: {
        title: "Terms & Conditions",
        lastUpdated: "September 2026",
        content: [
            { heading: "1. Acceptance of Terms", body: "By browsing our website, placing an order, or contacting us via WhatsApp, you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use of our services." },
            { heading: "2. Product Information", body: "We make every effort to display accurate product information, descriptions, and images. However, actual product colours may vary slightly due to screen settings. Product availability is subject to stock at the time of order confirmation." },
            { heading: "3. Pricing", body: "All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. Prices are subject to change without prior notice. The price applicable is the one confirmed at the time of WhatsApp order confirmation." },
            { heading: "4. Orders", body: "All orders are subject to availability confirmation via WhatsApp. Bhairav Art House reserves the right to cancel or decline any order for reasons including product unavailability, pricing errors, or suspicious activity." },
            { heading: "5. Payment Terms", body: "Payment is due at the time of delivery or store pickup. Accepted modes include cash, UPI (Google Pay, PhonePe, Paytm), and bank transfer. No online payment is collected through this website." },
            { heading: "6. Delivery", body: "Delivery timelines stated on our website are estimates and may vary due to traffic, weather, or courier delays. Bhairav Art House shall not be liable for delays beyond our reasonable control." },
            { heading: "7. Returns & Refunds", body: "Returns are accepted within 7 days of delivery for unused, unopened products in original condition. Consumable art materials (opened paint tubes, pens, etc.) are not returnable. Please refer to our Return & Refund Policy for full details." },
            { heading: "8. Intellectual Property", body: "All content on this website — including text, images, logos, and design — is the property of Bhairav Art House and protected by applicable Indian copyright law. Unauthorized use is strictly prohibited." },
            { heading: "9. Limitation of Liability", body: "Bhairav Art House shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services beyond the value of the product purchased." },
            { heading: "10. Governing Law", body: "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Hubballi, Karnataka." },
            { heading: "11. Contact", body: "For any questions about these Terms, please reach us at contact@bhairavarthouse.com or WhatsApp +91 98765 43210." }
        ]
    },
    shipping: {
        title: "Shipping & Delivery Policy",
        lastUpdated: "September 2026",
        content: [
            { heading: "Delivery Coverage", body: "We currently offer home delivery within Hubballi-Dharwad Municipal Corporation limits and surrounding areas within 15 km radius. For outstation orders across Karnataka, delivery is available via reputed courier partners." },
            { heading: "Delivery Timeline", body: "Orders within Hubballi city are typically delivered within 1–2 working days after WhatsApp order confirmation. Outstation orders may take 3–7 working days depending on the delivery location and courier service availability." },
            { heading: "Delivery Charges", body: "Orders above ₹500 within Hubballi: FREE delivery. Orders below ₹500 within Hubballi: ₹30–₹50 delivery charge. Outstation delivery charges are calculated based on parcel weight and destination — our team will share the exact charge via WhatsApp before dispatch." },
            { heading: "Store Pickup", body: "Free store pickup is available during business hours (Monday–Saturday, 10:00 AM to 8:00 PM) from our store at: Bhairav Art House, Opp. Station Road, Main Market, Hubballi — 580020." },
            { heading: "Order Confirmation & Dispatch", body: "Once your WhatsApp order is received, our team will confirm product availability within 2 working hours. You will receive an update when your order is dispatched with estimated delivery time." },
            { heading: "Tracking", body: "For outstation orders, we will share the courier tracking number via WhatsApp once dispatched. For local Hubballi deliveries, our delivery partner will coordinate timing directly with you." },
            { heading: "Failed Delivery Attempts", body: "If delivery is attempted and no one is available at the address, our team will coordinate with you via WhatsApp to arrange re-delivery. After 2 failed attempts, you may be requested to collect from our store." },
            { heading: "Delivery Exceptions", body: "Deliveries may be delayed or unavailable during public holidays, extreme weather, or other force majeure conditions. We will communicate any such delays via WhatsApp promptly." }
        ]
    },
    returns: {
        title: "Return & Refund Policy",
        lastUpdated: "September 2026",
        content: [
            { heading: "Return Eligibility", body: "You may return a product within 7 days of delivery, provided: (a) the product is unused and in original packaging, (b) all original labels, tags, and accessories are intact, and (c) the product is in resaleable condition. Opened or used paint tubes, bottles, pens, or consumables are not eligible for return." },
            { heading: "Non-Returnable Items", body: "The following items cannot be returned: Opened or partially used paints, inks, mediums, and solvents. Custom or special-order products. Products returned without original packaging. Any product showing signs of use, damage caused by the customer, or alteration." },
            { heading: "Damaged or Wrong Products", body: "If you receive a damaged, defective, or incorrect product, please WhatsApp us within 24 hours of delivery with clear photographs of the damage and the product packaging. We will arrange an immediate replacement or full refund at no additional cost to you." },
            { heading: "Return Process", body: "To initiate a return: (1) WhatsApp us at +91 98765 43210 with your order details and reason for return. (2) Our team will review and confirm return eligibility. (3) Drop off the product at our store OR we will arrange pickup for local Hubballi orders." },
            { heading: "Return Shipping Costs", body: "If the return is due to our error (wrong item, damaged item, quality defect): We bear all return shipping costs. If the return is due to customer preference (change of mind, ordered wrong size): The customer bears return shipping/courier costs." },
            { heading: "Refund Process", body: "Once the returned product is received and inspected (within 1–2 working days), we will approve the refund. Refunds are processed via the original payment method — cash returns are given at the store or via UPI to your registered number." },
            { heading: "Refund Timeline", body: "Cash/UPI refunds: Within 2–3 working days of return approval. Bank transfer refunds: Within 5–7 working days of return approval." },
            { heading: "Exchange Policy", body: "In addition to returns, we also offer product exchanges within 7 days for unused items of equal or higher value (with payment of the difference). Exchanges are processed at our store or coordinated via WhatsApp." }
        ]
    }
};

// Expose as globals (works in file:// and http://)
window.StoreData = {
    DEFAULT_CONFIG,
    DEFAULT_CATEGORIES,
    DEFAULT_PRODUCTS,
    FAQ_DATA,
    POLICIES
};
