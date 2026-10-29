/**
 * MerchantMate - Sample Sales Dataset
 * 
 * Realistic 14-day sales records for an artisanal lifestyle & coffee shop.
 * Designed to provide authentic weekly trends, weekend surges, and distinct product performance tiers.
 */

export const SAMPLE_PRODUCTS = [
  {
    id: "prod_1",
    name: "Artisan Espresso Blend (12oz)",
    category: "Beverages",
    price: 18.50,
    cost: 7.20,
    sku: "BEV-ESP-01",
    stock: 48,
    description: "Ethically sourced Colombian & Ethiopian single-origin roast with notes of chocolate and citrus.",
    badge: "High Performer"
  },
  {
    id: "prod_2",
    name: "Cold Brew Concentrate (32oz)",
    category: "Beverages",
    price: 22.00,
    cost: 8.50,
    sku: "BEV-CB-02",
    stock: 31,
    description: "Slow-steeped 18-hour cold brew elixir. Yields 8 rich, smooth servings.",
    badge: "Top Seller"
  },
  {
    id: "prod_3",
    name: "Handcrafted Ceramic Tumbler",
    category: "Home Goods",
    price: 34.00,
    cost: 14.00,
    sku: "HOM-TUM-03",
    stock: 16,
    description: "Double-walled handmade stoneware with matte speckle glaze, keeps drinks hot for hours.",
    badge: "High Margin"
  },
  {
    id: "prod_4",
    name: "Wild Lavender Soy Candle",
    category: "Home Goods",
    price: 26.00,
    cost: 9.00,
    sku: "HOM-CND-04",
    stock: 38,
    description: "Hand-poured pure soy wax with organic French lavender and cedarwood essential oils.",
    badge: "Steady Seller"
  },
  {
    id: "prod_5",
    name: "Heavyweight Organic Linen Tote",
    category: "Accessories",
    price: 28.00,
    cost: 10.50,
    sku: "ACC-TOT-05",
    stock: 54,
    description: "Sturdy 14oz unbleached natural flax linen with reinforced box stitching and inner key pocket.",
    badge: "Steady Seller"
  },
  {
    id: "prod_6",
    name: "Minimalist Brass Coffee Scoop",
    category: "Accessories",
    price: 16.00,
    cost: 5.00,
    sku: "ACC-SCP-06",
    stock: 22,
    description: "Precision 1-tablespoon measurement machined from solid spun brass with satin finish.",
    badge: "Steady Seller"
  },
  {
    id: "prod_7",
    name: "Botanical Shea Butter Soap Bar",
    category: "Personal Care",
    price: 9.50,
    cost: 2.80,
    sku: "PER-SOP-07",
    stock: 75,
    description: "Cold-process moisturizing soap enriched with raw African shea butter and eucalyptus.",
    badge: "Volume Item"
  },
  {
    id: "prod_8",
    name: "Cedarwood Beard & Face Elixir",
    category: "Personal Care",
    price: 24.00,
    cost: 8.00,
    sku: "PER-OIL-08",
    stock: 19,
    description: "Cold-pressed jojoba and argan oil infused with Texas cedar and bergamot.",
    badge: "Needs Attention"
  }
];

/**
 * Daily sales transactions grouped across 14 consecutive days (Oct 15 - Oct 28).
 * Week 1: Previous 7 days (Oct 15 - Oct 21)
 * Week 2: Current 7 days (Oct 22 - Oct 28)
 */
export const DAILY_SALES_RECORDS = [
  // --- PREVIOUS WEEK (OCT 15 - OCT 21) ---
  {
    date: "2026-10-15",
    dayName: "Wednesday",
    shortDay: "Oct 15",
    period: "previous",
    ordersCount: 22,
    salesByProduct: {
      prod_1: 14,
      prod_2: 12,
      prod_3: 3,
      prod_4: 4,
      prod_5: 5,
      prod_6: 3,
      prod_7: 15,
      prod_8: 2
    }
  },
  {
    date: "2026-10-16",
    dayName: "Thursday",
    shortDay: "Oct 16",
    period: "previous",
    ordersCount: 25,
    salesByProduct: {
      prod_1: 16,
      prod_2: 14,
      prod_3: 4,
      prod_4: 5,
      prod_5: 6,
      prod_6: 4,
      prod_7: 18,
      prod_8: 1
    }
  },
  {
    date: "2026-10-17",
    dayName: "Friday",
    shortDay: "Oct 17",
    period: "previous",
    ordersCount: 32,
    salesByProduct: {
      prod_1: 22,
      prod_2: 20,
      prod_3: 6,
      prod_4: 8,
      prod_5: 8,
      prod_6: 6,
      prod_7: 24,
      prod_8: 3
    }
  },
  {
    date: "2026-10-18",
    dayName: "Saturday",
    shortDay: "Oct 18",
    period: "previous",
    ordersCount: 42,
    salesByProduct: {
      prod_1: 30,
      prod_2: 28,
      prod_3: 9,
      prod_4: 12,
      prod_5: 11,
      prod_6: 8,
      prod_7: 32,
      prod_8: 4
    }
  },
  {
    date: "2026-10-19",
    dayName: "Sunday",
    shortDay: "Oct 19",
    period: "previous",
    ordersCount: 36,
    salesByProduct: {
      prod_1: 24,
      prod_2: 22,
      prod_3: 7,
      prod_4: 9,
      prod_5: 9,
      prod_6: 7,
      prod_7: 28,
      prod_8: 2
    }
  },
  {
    date: "2026-10-20",
    dayName: "Monday",
    shortDay: "Oct 20",
    period: "previous",
    ordersCount: 19,
    salesByProduct: {
      prod_1: 12,
      prod_2: 10,
      prod_3: 2,
      prod_4: 3,
      prod_5: 4,
      prod_6: 3,
      prod_7: 14,
      prod_8: 1
    }
  },
  {
    date: "2026-10-21",
    dayName: "Tuesday",
    shortDay: "Oct 21",
    period: "previous",
    ordersCount: 23,
    salesByProduct: {
      prod_1: 15,
      prod_2: 13,
      prod_3: 4,
      prod_4: 5,
      prod_5: 5,
      prod_6: 4,
      prod_7: 16,
      prod_8: 2
    }
  },

  // --- CURRENT 7 DAYS (OCT 22 - OCT 28) ---
  {
    date: "2026-10-22",
    dayName: "Wednesday",
    shortDay: "Wed",
    displayDate: "Wednesday, Oct 22",
    period: "current",
    ordersCount: 28,
    salesByProduct: {
      prod_1: 18,
      prod_2: 16,
      prod_3: 5,
      prod_4: 6,
      prod_5: 7,
      prod_6: 4,
      prod_7: 20,
      prod_8: 2
    }
  },
  {
    date: "2026-10-23",
    dayName: "Thursday",
    shortDay: "Thu",
    displayDate: "Thursday, Oct 23",
    period: "current",
    ordersCount: 31,
    salesByProduct: {
      prod_1: 20,
      prod_2: 19,
      prod_3: 6,
      prod_4: 7,
      prod_5: 8,
      prod_6: 5,
      prod_7: 22,
      prod_8: 3
    }
  },
  {
    date: "2026-10-24",
    dayName: "Friday",
    shortDay: "Fri",
    displayDate: "Friday, Oct 24",
    period: "current",
    ordersCount: 41,
    salesByProduct: {
      prod_1: 28,
      prod_2: 26,
      prod_3: 8,
      prod_4: 10,
      prod_5: 11,
      prod_6: 7,
      prod_7: 30,
      prod_8: 4
    }
  },
  {
    date: "2026-10-25",
    dayName: "Saturday",
    shortDay: "Sat",
    displayDate: "Saturday, Oct 25",
    period: "current",
    ordersCount: 56, // Peak weekend shopping!
    salesByProduct: {
      prod_1: 38,
      prod_2: 35,
      prod_3: 13,
      prod_4: 16,
      prod_5: 15,
      prod_6: 10,
      prod_7: 44,
      prod_8: 5
    }
  },
  {
    date: "2026-10-26",
    dayName: "Sunday",
    shortDay: "Sun",
    displayDate: "Sunday, Oct 26",
    period: "current",
    ordersCount: 46,
    salesByProduct: {
      prod_1: 32,
      prod_2: 30,
      prod_3: 10,
      prod_4: 12,
      prod_5: 12,
      prod_6: 8,
      prod_7: 36,
      prod_8: 3
    }
  },
  {
    date: "2026-10-27",
    dayName: "Monday",
    shortDay: "Mon",
    displayDate: "Monday, Oct 27",
    period: "current",
    ordersCount: 26,
    salesByProduct: {
      prod_1: 17,
      prod_2: 15,
      prod_3: 4,
      prod_4: 5,
      prod_5: 6,
      prod_6: 4,
      prod_7: 18,
      prod_8: 2
    }
  },
  {
    date: "2026-10-28",
    dayName: "Tuesday",
    shortDay: "Tue",
    displayDate: "Tuesday, Oct 28",
    period: "current",
    ordersCount: 30,
    salesByProduct: {
      prod_1: 19,
      prod_2: 18,
      prod_3: 6,
      prod_4: 7,
      prod_5: 8,
      prod_6: 5,
      prod_7: 21,
      prod_8: 2
    }
  }
];
