import { cache } from 'react';

// Server-side rendering cache configuration
export const ssrCache = {
  // Cache for product data
  products: cache(async (key: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${key}`, {
      next: { revalidate: 300 } // 5 minutes
    });
    return response.json();
  }),

  // Cache for featured products
  featuredProducts: cache(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?featured=true&limit=6`, {
      next: { revalidate: 600 } // 10 minutes
    });
    return response.json();
  }),

  // Cache for product details
  productDetails: cache(async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
      next: { revalidate: 1800 } // 30 minutes
    });
    return response.json();
  })
};

// Static generation helpers
export const generateStaticParams = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=1000`);
    const data = await response.json();
    
    if (data.success && data.data?.products) {
      return data.data.products.map((product: any) => ({
        id: product._id
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
};

// Revalidation helpers
export const revalidateProducts = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/revalidate/products`, {
      method: 'POST'
    });
  } catch (error) {
    console.error('Failed to revalidate products:', error);
  }
};

// ISR (Incremental Static Regeneration) configuration
export const isrConfig = {
  // Product pages
  product: {
    revalidate: 1800, // 30 minutes
    tags: ['products']
  },
  
  // Product list pages
  products: {
    revalidate: 300, // 5 minutes
    tags: ['products', 'product-list']
  },
  
  // Featured products
  featured: {
    revalidate: 600, // 10 minutes
    tags: ['products', 'featured']
  },
  
  // Home page
  home: {
    revalidate: 300, // 5 minutes
    tags: ['home', 'featured']
  }
};

// Cache tags for selective revalidation
export const cacheTags = {
  PRODUCTS: 'products',
  FEATURED: 'featured',
  HOME: 'home',
  PRODUCT_LIST: 'product-list'
} as const;