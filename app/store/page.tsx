'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

interface ProductItem {
  id: string;
  name: string;
  category: 'Uniform' | 'Books' | 'Merch' | 'Equipment';
  description: string;
  price: number;
  icon: string;
  badge?: string;
  inStock: boolean;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'p1',
    name: 'Senior School Blazer',
    category: 'Uniform',
    description: 'Sizes 36–44 · Wool blend with woven school crest',
    price: 2850,
    icon: 'checkroom',
    badge: 'Mandatory',
    inStock: true,
  },
  {
    id: 'p2',
    name: 'House T-Shirt (Blue - Phoenix)',
    category: 'Merch',
    description: 'Sizes S–XL · Breathable dry-fit sports cotton',
    price: 650,
    icon: 'styler',
    inStock: true,
  },
  {
    id: 'p3',
    name: 'Lab Record + Graph Bundle',
    category: 'Books',
    description: 'Physics & Chemistry practical sets with hardbound covers',
    price: 320,
    icon: 'menu_book',
    badge: 'Required',
    inStock: true,
  },
  {
    id: 'p4',
    name: 'Formal Navy Trousers',
    category: 'Uniform',
    description: 'Sizes 28–38 · Wrinkle-resistant polyester viscose',
    price: 1200,
    icon: 'apparel',
    inStock: true,
  },
  {
    id: 'p5',
    name: 'School Crest Tie & Belt Set',
    category: 'Uniform',
    description: 'Regulation striped tie + brass buckle canvas belt',
    price: 450,
    icon: 'straighten',
    inStock: true,
  },
  {
    id: 'p6',
    name: 'Senior Chemistry Coat & Goggles',
    category: 'Equipment',
    description: 'Cotton safety apron + UV-certified splash goggles',
    price: 780,
    icon: 'biotech',
    inStock: true,
  },
  {
    id: 'p7',
    name: 'Mathematics Geometry Instrument Kit',
    category: 'Equipment',
    description: 'Precision compass, divider, protractor and set squares',
    price: 390,
    icon: 'architecture',
    inStock: true,
  },
  {
    id: 'p8',
    name: 'Official Campus Backpack (32L)',
    category: 'Merch',
    description: 'Water-resistant, padded laptop compartment, school patch',
    price: 1850,
    icon: 'backpack',
    inStock: true,
  },
];

const CATEGORIES = ['All', 'Uniform', 'Books', 'Equipment', 'Merch'];

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [orderNotification, setOrderNotification] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: ProductItem) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
    setOrderNotification(`Added "${product.name}" to counter pickup order.`);
    setTimeout(() => setOrderNotification(null), 4000);
  };

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalCartPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const prod = PRODUCTS.find((p) => p.id === id);
    return sum + (prod ? prod.price * qty : 0);
  }, 0);

  return (
    <PortalShell title="School Store" activePath="store">
      <div className="flex flex-col w-full relative gap-space-md">
        {/* Ambient Backdrops */}
        <div className="absolute -top-10 -left-12 w-64 h-64 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-72 -right-16 w-72 h-72 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>

        {/* Top Search & Filter Bar */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search uniforms, textbooks, lab bundles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-surface-container-high/40 rounded-xl text-[14px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {orderNotification && (
          <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-xl text-[13px] font-semibold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>{orderNotification}</span>
            </div>
            <span className="text-[12px] font-bold underline cursor-pointer" onClick={() => setOrderNotification(null)}>
              Dismiss
            </span>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
          {/* Main Product Catalog */}
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-bold text-on-surface">
                Catalog Items <span className="text-outline font-normal">({filteredProducts.length})</span>
              </p>
              <span className="text-[12px] text-on-surface-variant">Counter Pickup within 24h</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline/10 p-4 flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-primary text-[24px]">{prod.icon}</span>
                      </div>
                      {prod.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-secondary text-[10px] font-bold tracking-wide uppercase">
                          {prod.badge}
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <h4 className="text-[14px] font-bold text-on-surface line-clamp-1">{prod.name}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline/10 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-outline uppercase block">Price</span>
                      <span className="text-[16px] font-extrabold text-primary">₹{prod.price.toLocaleString('en-IN')}</span>
                    </div>
                    <button
                      onClick={() => addToCart(prod)}
                      className="h-[36px] px-4 rounded-full bg-primary text-white text-[12px] font-bold hover:bg-primary/90 transition-transform active:scale-95 flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                      Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Rail: Cart Summary & Store Info */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            {/* Pickup Cart Summary Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline/10">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">shopping_cart</span>
                  <h3 className="font-headline-sm text-[15px] text-on-surface font-bold">Pickup Cart</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                  {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              {totalCartCount === 0 ? (
                <div className="py-6 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px] text-outline/50 mb-1">production_quantity_limits</span>
                  <p className="text-[12px]">Your counter order bag is empty.</p>
                  <p className="text-[11px] text-outline mt-0.5">Click &quot;Order&quot; on any item to reserve.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {Object.entries(cart).map(([id, qty]) => {
                      const prod = PRODUCTS.find((p) => p.id === id);
                      if (!prod) return null;
                      return (
                        <div key={id} className="flex items-center justify-between text-[12px] py-1 border-b border-outline/5">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-on-surface truncate">{prod.name}</p>
                            <p className="text-outline text-[11px]">₹{prod.price} × {qty}</p>
                          </div>
                          <span className="font-bold text-on-surface ml-2">₹{(prod.price * qty).toLocaleString('en-IN')}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-2 border-t border-outline/10 flex items-center justify-between text-[14px] font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary text-[16px]">₹{totalCartPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Order placed successfully for ₹${totalCartPrice}! Collection slip generated for Student Rajen Shaw.`);
                      setCart({});
                    }}
                    className="w-full h-10 rounded-full bg-primary text-white font-bold text-[13px] shadow-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Confirm Counter Order</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>

            {/* Store Counter Details */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-secondary text-[20px]">storefront</span>
                <h3 className="font-headline-sm text-[14px] text-on-surface font-bold">Counter Pickup Info</h3>
              </div>
              <ul className="space-y-2.5 text-[12px] text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-outline text-[16px] mt-0.5">location_on</span>
                  <span>Senior School Store, Wing A Ground Floor (adjacent to Accounts Office).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-outline text-[16px] mt-0.5">schedule</span>
                  <span>Counter Timings: Mon–Sat, 08:30 AM to 03:30 PM.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-outline text-[16px] mt-0.5">receipt</span>
                  <span>Charges are billed directly to your student ledger or payable via UPI.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-outline text-[16px] mt-0.5">sync_alt</span>
                  <span>Uniform exchanges accepted within 7 school days with original tags intact.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
