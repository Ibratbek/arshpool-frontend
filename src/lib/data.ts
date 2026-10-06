// Static snapshots of the former backend API (see src/data/*.json).
import products from "@/data/products.json";
import landingProducts from "@/data/landing-products.json";
import categories from "@/data/categories.json";
import projects from "@/data/projects.json";
import productDetails from "@/data/product-details.json";
import categoryDetails from "@/data/category-details.json";
import type { CategoryType, ProductDetailType, ProductListType } from "@/types/product";
import type { GallaryType } from "@/types/gallary";

export const getProducts = () => products as unknown as ProductListType[];
export const getLandingProducts = () => landingProducts as unknown as ProductListType[];
export const getCategories = () => categories as unknown as CategoryType[];
export const getProjects = () => projects as unknown as GallaryType[];

export const getProductDetail = (id: string) =>
  (productDetails as unknown as Record<string, ProductDetailType>)[id];
export const getProductIds = () => Object.keys(productDetails);

export const getCategoryDetail = (slug: string) =>
  (categoryDetails as unknown as Record<string, CategoryType>)[slug];
export const getCategoryIds = () => Object.keys(categoryDetails);
