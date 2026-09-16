export interface MapleItem {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// The first twelve monster rewards follow this story order.
export const MAPLE_DROPPABLE_ITEMS: MapleItem[] = [
  {
    "id": "maple-roots",
    "name": "A Maple Beginning",
    "icon": "maple.png",
    "description": "I was born in Vietnam and moved to Canada at age 10."
  },
  {
    "id": "uoft-diploma",
    "name": "The University Chapter",
    "icon": "book.png",
    "description": "I graduated from the University of Toronto in 2022 with a degree in Computer Science."
  },
  {
    "id": "rbc-coin",
    "name": "The Main Quest",
    "icon": "coin.png",
    "description": "My main quest these days: Building software as a Senior Software Engineer at RBC."
  },
  {
    "id": "engineer-screw",
    "name": "The Builder’s Toolkit",
    "icon": "screw.png",
    "description": "I’ve spent five years building financial technology. I like being there for the whole process, from a rough idea to building something people can actually use."
  },
  {
    "id": "side-project-chair",
    "name": "The AFK Chair",
    "icon": "chair.png",
    "description": "Some days I’m happy doing nothing, relaxing, and browsing the internet."
  },
  {
    "id": "toronto-business",
    "name": "The Shopkeeper Chapter",
    "icon": "salon.png",
    "description": "For 2.5 years, I wore two hats: software engineer and owner of a Toronto small business with eight employees. I sold the business in summer 2026."
  },
  {
    "id": "community-letter",
    "name": "A Helping Hand",
    "icon": "letter.png",
    "description": "I enjoy giving back through volunteering and community involvement. Helping build Shelter Movers’ volunteer itinerary platform was one way to put my coding skills to good use."
  },
  {
    "id": "plant-leaf",
    "name": "An Aspiring Green Thumb",
    "icon": "leaf.png",
    "description": "I love plants, but I don’t have a green thumb. Still working on that skill."
  },
  {
    "id": "baking-cake",
    "name": "Something in the Oven",
    "icon": "cake.png",
    "description": "I love baking and trying new recipes. A nice change of pace from a screen, with something sweet at the end."
  },
  {
    "id": "travel-ticket",
    "name": "An Open Ticket",
    "icon": "ticket.png",
    "description": "I’d like to see more of the world, and try the local food. Still deciding where the next ticket should take me."
  },
  {
    "id": "curiosity-scroll",
    "name": "A Few Side Quests",
    "icon": "scroll.png",
    "description": "I'm always curious to try something new. Side quests are where I experiment and learn."
  },
  {
    "id": "rpg-mushroom",
    "name": "Back to Henesys",
    "icon": "mushroom.png",
    "description": "I love RPGs, especially MapleStory. That’s why you are greeted by mushrooms and some relaxing music."
  }
];
