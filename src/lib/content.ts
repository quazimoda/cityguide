import { categories } from '@/data/categories';import { guides } from '@/data/guides';import { blogPosts } from '@/data/blog';
export const getCategory=(slug:string)=>categories.find(c=>c.slug===slug);
export const getGuidesByCategory=(slug:string)=>guides.filter(g=>getCategory(slug)?.title===g.category);
export const getGuide=(category:string,slug:string)=>getGuidesByCategory(category).find(g=>g.slug===slug);
export const getBlogPost=(slug:string)=>blogPosts.find(p=>p.slug===slug);
export const categorySlugByTitle=(title:string)=>categories.find(c=>c.title===title)?.slug ?? 'guides';
