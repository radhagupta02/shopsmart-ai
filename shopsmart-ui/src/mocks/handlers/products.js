import { PRODUCTS, toCatalogItem, toProductDetail } from '../data/products.js';
import { CATEGORIES_TREE, getCategoryAndDescendantIds } from '../data/categories.js';
import { createMockError } from '../errors.js';

const VALID_SORTS = ['relevance', 'price_asc', 'price_desc', 'rating', 'newest'];

export function handleListProducts({ query = {} }) {
  const {
    q,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    sort = 'relevance',
    page = 1,
    size = 12,
  } = query;

  // Validate sort
  if (sort && !VALID_SORTS.includes(sort)) {
    throw createMockError('Invalid sort parameter', 400, [
      { field: 'sort', message: `Allowed sort values: ${VALID_SORTS.join(', ')}` },
    ]);
  }

  let filtered = [...PRODUCTS];

  // 1. Text search `q`
  if (q && String(q).trim()) {
    const term = String(q).trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term)
    );
  }

  // 2. Category (including descendants)
  if (category !== undefined && category !== null && category !== '') {
    const validCategoryIds = getCategoryAndDescendantIds(category);
    filtered = filtered.filter((p) => validCategoryIds.includes(Number(p.categoryId)));
  }

  // 3. Brand (supports single string or array)
  if (brand) {
    const brands = (Array.isArray(brand) ? brand : [brand])
      .flatMap((b) => (typeof b === 'string' ? b.split(',') : [String(b)]))
      .map((b) => b.trim().toLowerCase())
      .filter(Boolean);

    if (brands.length > 0) {
      filtered = filtered.filter((p) => brands.includes(p.brand.toLowerCase()));
    }
  }

  // 4. Price range
  if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
    const min = parseFloat(minPrice);
    if (!Number.isNaN(min)) {
      filtered = filtered.filter((p) => p.price >= min);
    }
  }
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
    const max = parseFloat(maxPrice);
    if (!Number.isNaN(max)) {
      filtered = filtered.filter((p) => p.price <= max);
    }
  }

  // 5. Min Rating
  if (minRating !== undefined && minRating !== null && minRating !== '') {
    const ratingThreshold = parseFloat(minRating);
    if (!Number.isNaN(ratingThreshold)) {
      filtered = filtered.filter((p) => p.rating >= ratingThreshold);
    }
  }

  // 6. In Stock filter
  if (inStock === true || inStock === 'true' || inStock === '1') {
    filtered = filtered.filter((p) => p.stockQty > 0);
  }

  // 7. Sorting
  switch (sort) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filtered.sort((a, b) => b.id.localeCompare(a.id));
      break;
    case 'relevance':
    default:
      // Leave default order or sort by rating
      break;
  }

  // 8. Pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const sizeNum = Math.min(50, Math.max(1, parseInt(size, 10) || 12));
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / sizeNum) || 1;
  const start = (pageNum - 1) * sizeNum;
  const pagedItems = filtered.slice(start, start + sizeNum);

  return {
    items: pagedItems.map(toCatalogItem),
    page: pageNum,
    totalPages,
    totalItems,
  };
}

export function handleGetProduct({ params }) {
  const { id } = params;
  const product = PRODUCTS.find((p) => p.id.toUpperCase() === (id || '').toUpperCase());
  if (!product) {
    throw createMockError(`Product ${id} not found`, 404);
  }
  return toProductDetail(product);
}

export function handleGetCategories() {
  return CATEGORIES_TREE;
}
