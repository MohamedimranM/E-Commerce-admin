// ── User & Auth ──────────────────────────────────────────────
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// ── Users API ────────────────────────────────────────────────
export interface UsersResponse {
  success: boolean;
  users: User[];
}

export interface UserResponse {
  success: boolean;
  user: User;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

// ── Products ─────────────────────────────────────────────────
export interface ProductImage {
  url: string;
  public_id: string;
  _id?: string;
}

// ── Reviews ──────────────────────────────────────────────────
export interface Review {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewPayload {
  rating: number;
  comment: string;
}

export interface AddReviewResponse {
  success: boolean;
  message: string;
}

export interface Product {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  images: ProductImage[];
  brand: string;
  category: string;
  description: string;
  reviews: Review[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  isFeatured: boolean;
  user: Pick<User, "name" | "email"> | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPayload {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  isFeatured?: boolean;
  images?: ProductImage[];
}

export interface ProductsResponse {
  success: boolean;
  totalProducts: number;
  products: Product[];
}

export interface ProductResponse {
  success: boolean;
  product: Product;
}

export interface ImageUploadResponse {
  url: string;
  public_id: string;
}

// ── API Error ────────────────────────────────────────────────
export interface ApiError {
  message: string;
  statusCode?: number;
}

// ── Banners ──────────────────────────────────────────────────
export interface BannerImage {
  url: string;
  public_id: string;
}

export interface Banner {
  _id: string;
  name: string;
  image: BannerImage;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannersResponse {
  success: boolean;
  totalBanners: number;
  banners: Banner[];
}

export interface BannerResponse {
  success: boolean;
  banner: Banner;
}
