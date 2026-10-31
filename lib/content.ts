import data from "@/data/content.json";

export type Service = (typeof data.services)[number];
export type Product = (typeof data.products)[number];
export type NewsItem = (typeof data.news)[number];
export const services = data.services;
export const products = data.products;
export const news = data.news;
export const serviceCategories = ["همه", ...new Set(services.map((item) => item.category))];
export const newsCategories = ["همه", ...new Set(news.map((item) => item.category))];
