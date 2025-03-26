import axios from "axios";

async function toggleWishlist(productId: string) {
  try {
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_SERVER_URL}/api/product/toggle-wishlist`,
      { productId }
    );

    return res;
  } catch (error) {
    return { error: true, message: (error as any).response.data.message };
  }
}

export { toggleWishlist };
