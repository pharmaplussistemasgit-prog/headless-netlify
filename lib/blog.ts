import { unstable_cache } from "next/cache";

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://tienda.pharmaplus.com.co';

export interface BlogPost {
    id: number;
    date: string;
    slug: string;
    title: { rendered: string };
    content: { rendered: string };
    excerpt: { rendered: string };
    _embedded?: {
        'wp:featuredmedia'?: Array<{ source_url: string }>;
        'author'?: Array<{ name: string }>;
    };
}

/**
 * Fetch posts from WordPress
 */
export const getPosts = unstable_cache(
    async (page = 1, perPage = 9): Promise<BlogPost[]> => {
        try {
            const res = await fetch(`${WP_API_URL}/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}`);
            if (!res.ok) throw new Error('Failed to fetch posts');
            return await res.json();
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            return [];
        }
    },
    ['blog-posts-list'],
    { revalidate: 3600 }
);

/**
 * Fetch single post by slug
 */
export const getPostBySlug = unstable_cache(
    async (slug: string): Promise<BlogPost | null> => {
        try {
            const res = await fetch(`${WP_API_URL}/wp-json/wp/v2/posts?_embed&slug=${slug}`);
            if (!res.ok) throw new Error('Failed to fetch post');
            const posts = await res.json();
            return posts.length > 0 ? posts[0] : null;
        } catch (error) {
            console.error(`Error fetching post ${slug}:`, error);
            return null;
        }
    },
    ['blog-post-single'], // This key should ideally include slug but unstable_cache usage varies. 
    // For safer detailed cache, we rely on the function arguments which unstable_cache handles.
    { revalidate: 3600 }
);
