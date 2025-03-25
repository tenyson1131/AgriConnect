export interface UserInterface {
  _id: string;
  uid?: string;
  name: string;
  email: string;
  img: string;
  role: "buyer" | "farmer";
  farmName?: string;
  cart: {
    user: string;
    items: CartItem[];
  };
  verified: boolean;
}

type ProductCategory =
  | "Fruits"
  | "Vegetables"
  | "Herbs and Spices"
  | "Grains and Pulses"
  | "Nuts and Dry Fruits"
  | "Dairy and Animal Products"
  | "Organic and Specialty Products"
  | "Handmade Pickles"
  | "Farming Inputs and Supplies"
  | "Handmade Snacks";

export interface ProductInterface {
  _id: string;
  name: string;
  desc: string;
  price: number;
  images: string[];
  category: ProductCategory;
  stock: number;
  seller: string;
  farmName: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  createdAt?: Date | string;
}

export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PostInterface {
  _id: string;
  title: string;
  content: string;
  img: string;
  author: {
    id: string;
    name: string;
    img: string;
  };
  category: "farmers" | "buyers" | "general";
  likes: [string];
  commentCount: number;
  createdAt: Date | string;
}

export interface CommentInterface {
  _id: string;
  postId: string;
  author: {
    name: string;
    img: string;
  };
  content: string;
  likes: [string];
  replies: [
    {
      author: {
        name: string;
        img: string;
      };
      content: string;
      likes: [string];
      createdAt: Date | string;
    }
  ];
  createdAt: Date | string;
}
