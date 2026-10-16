export const SITE = {
  name: "FIKA Cafe",
  address: "28 Kensington Ave, Toronto, ON M5T 2J9",
  email: "info@fika.ca",
  phone: "+91XXXXXXXXXX",
  callUrl: "tel:+91XXXXXXXXXX",
  whatsappUrl: "https://wa.me/91XXXXXXXXXX?text=" + encodeURIComponent("I am interested in your services"),
  instagram: "https://www.instagram.com/fikakensington/",
  shop: "https://www.fika.ca/products",
  giftCard: "https://squareup.com/gift/MLW6W9962BE9K/order",
  officialMenu: "https://www.fika.ca/cafe-menu",
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=FIKA+Cafe+28+Kensington+Ave+Toronto+ON",
  mapEmbed:
    "https://www.google.com/maps?q=FIKA+Cafe,+28+Kensington+Ave,+Toronto,+ON&output=embed",
  logo: "https://images.squarespace-cdn.com/content/v1/59382d0f8419c22045f22376/1496854048621-NEIB2SF7C4M7MQJJNABM/GREEN-LOGO.png",
};

export type MenuItem = { name: string; note?: string };
export type MenuCategory = { id: string; title: string; note?: string; items: MenuItem[] };

// Source: fika.ca/cafe-menu. Prices are not published there, so none are shown.
export const MENU: MenuCategory[] = [
  {
    id: "hot",
    title: "Hot Signatures",
    items: [
      { name: "“Kardemumma” Cardamom Latte" },
      { name: "Black Forest Mocha", note: "Fall / Winter" },
      { name: "Matcha Bliss Latte" },
      { name: "Matcha Ember Latte", note: "Fall / Winter" },
      { name: "Lavender White Hot Chocolate" },
    ],
  },
  {
    id: "iced",
    title: "Iced Signatures",
    items: [
      { name: "Fika Iced Cardamom Latte" },
      { name: "Iced Matcha Bliss" },
      { name: "I.P.A. Iced Pineapple Americano" },
    ],
  },
  {
    id: "pourover",
    title: "Pour Over",
    note: "A curated pour-over menu is available on weekdays only.",
    items: [{ name: "Rotating multi-roaster selection", note: "Ask your barista" }],
  },
  {
    id: "food",
    title: "Food",
    items: [{ name: "Breakfast Egg Sandwich" }, { name: "Smoked Salmon Sandwich" }],
  },
  {
    id: "pastries",
    title: "Pastries",
    note: "All made in house, from scratch.",
    items: [
      { name: "“Kanelbulle” Swedish Cinnamon Bun" },
      { name: "Hazelnut Praline Brownie" },
      { name: "Matcha White Chocolate Cookie" },
      { name: "Cranberry Oat Cookie" },
      { name: "Caramel Marble Cake", note: "Weekends only" },
      { name: "Semla", note: "December till Easter" },
    ],
  },
];

export const PRESS = [
  { outlet: "World's 100 Best Coffee Shops", quote: "#25 of the 100 best coffee shops in the Americas, 2026", url: "https://theworlds100bestcoffeeshops.com/locales-north/fika-cafe/" },
  { outlet: "Condé Nast Traveler", quote: "Fika Cafe, Toronto", url: "https://www.cntraveler.com/bars/toronto/fika-cafe" },
  { outlet: "Walkaboot Travel", quote: "5 best coffee shops in Toronto you should visit", url: "https://walkaboot.ca/canada/5-best-coffee-shops-toronto/" },
];
