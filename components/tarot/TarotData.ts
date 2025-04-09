// TarotData.ts - Contains tarot card data

export interface TarotCard {
  id: number;
  name: string;
  image: string;
}

export const tarotCards: TarotCard[] = [
  { id: 0, name: "The Fool", image: "/image/fool.png" },
  { id: 1, name: "The Magician", image: "/image/magician.png" },
  { id: 2, name: "The High Priestess", image: "/image/high_priestess.png" },
  { id: 3, name: "The Empress", image: "/image/empress.png" },
  { id: 4, name: "The Emperor", image: "/image/emperor.png" },
  { id: 5, name: "The Hierophant", image: "/image/hierophant.png" },
  { id: 6, name: "The Lovers", image: "/image/lovers.png" },
  { id: 7, name: "The Chariot", image: "/image/chariot.png" },
  { id: 8, name: "Strength", image: "/image/strength.png" },
  { id: 9, name: "The Hermit", image: "/image/hermit.png" },
  { id: 10, name: "Wheel of Fortune", image: "/image/wheel_of_fortune.png" },
  { id: 11, name: "Justice", image: "/image/justice.png" },
  { id: 12, name: "The Hanged Man", image: "/image/hanged_man.png" },
  { id: 13, name: "Death", image: "/image/death.png" },
  { id: 14, name: "Temperance", image: "/image/temperance.png" },
  { id: 15, name: "The Devil", image: "/image/devil.png" },
  { id: 16, name: "The Tower", image: "/image/tower.png" },
  { id: 17, name: "The Star", image: "/image/star.png" },
  { id: 18, name: "The Moon", image: "/image/moon.png" },
  { id: 19, name: "The Sun", image: "/image/sun.png" },
  { id: 20, name: "Judgement", image: "/image/judgement.png" },
  { id: 21, name: "The World", image: "/image/world.png" },
];
