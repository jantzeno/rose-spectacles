export const photos = {
    olive: { position: '0% 0%', alt: 'Olive canvas weekender bag' },
    oliveDetail: { position: '50% 0%', alt: 'Olive canvas zipper and strap detail' },
    clay: { position: '100% 0%', alt: 'Clay canvas weekender bag' },
    clayDetail: { position: '0% 100%', alt: 'Clay canvas zipper and strap detail' },
    beanie: { position: '50% 100%', alt: 'Charcoal ribbed wool beanie' },
    bottle: { position: '100% 100%', alt: 'Cream insulated bottle' }
} as const;

export type ProductPhotoName = keyof typeof photos;

export const categories = ['Bags', 'Accessories', 'Drinkware'] as const;
export type ProductCategory = (typeof categories)[number];

export interface CatalogProduct {
    id: string;
    name: string;
    category: ProductCategory;
    price: number;
    inStock: boolean;
    photo: ProductPhotoName;
}

export const products: CatalogProduct[] = [
    { id: 'olive-weekender', name: 'Canvas Weekender · Olive', category: 'Bags', price: 84, inStock: true, photo: 'olive' },
    { id: 'clay-weekender', name: 'Canvas Weekender · Clay', category: 'Bags', price: 92, inStock: true, photo: 'clay' },
    { id: 'charcoal-beanie', name: 'Ribbed Wool Beanie', category: 'Accessories', price: 32, inStock: false, photo: 'beanie' },
    { id: 'cream-bottle', name: 'Insulated Bottle', category: 'Drinkware', price: 28, inStock: true, photo: 'bottle' }
];

export const formatMoney = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format;
