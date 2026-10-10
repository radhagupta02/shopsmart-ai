-- Users
INSERT INTO users (id, name, email, password_hash, tier, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Basic User', 'basic@demo.com', '$2b$10$8PDyx8WALLx406luB.SqruWYb/U8fZTMeN7tsyMcqWMsyjQmXuYT.', 'Basic', 'USER'),
  ('22222222-2222-2222-2222-222222222222', 'Prime User', 'prime@demo.com', '$2b$10$8PDyx8WALLx406luB.SqruWYb/U8fZTMeN7tsyMcqWMsyjQmXuYT.', 'Prime', 'USER'),
  ('33333333-3333-3333-3333-333333333333', 'Premium User', 'premium@demo.com', '$2b$10$8PDyx8WALLx406luB.SqruWYb/U8fZTMeN7tsyMcqWMsyjQmXuYT.', 'Premium', 'USER'),
  ('44444444-4444-4444-4444-444444444444', 'Admin User', 'admin@demo.com', '$2b$10$8PDyx8WALLx406luB.SqruWYb/U8fZTMeN7tsyMcqWMsyjQmXuYT.', 'Premium', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Categories
INSERT INTO categories (id, name, parent_id) VALUES
  (1, 'Electronics', NULL),
  (2, 'Laptops', 1),
  (3, 'Smartphones', 1),
  (4, 'Audio', 1),
  (5, 'Apparel', NULL),
  (6, 'Shoes', 5),
  (7, 'Clothing', 5),
  (8, 'Books', NULL)
ON CONFLICT DO NOTHING;

-- User Preferences (prime@demo.com prefers Laptops, 500-1500)
INSERT INTO user_preferences (user_id, categories, brands, budget_min, budget_max) VALUES
  ('22222222-2222-2222-2222-222222222222', ARRAY[2], ARRAY['Dell', 'Lenovo'], 500.00, 1500.00)
ON CONFLICT DO NOTHING;

-- Products
INSERT INTO products (id, name, category_id, brand, description, price, rating, stock_qty, specs, images) VALUES
  -- 1. Hero Laptop
  ('LAP101', 'Dell Inspiron 15', 2, 'Dell', 'Reliable workhorse for Java development and AI projects. Features 16GB RAM.', 899.00, 4.5, 50, '{"ramGb": 16, "cpu": "Core i7"}', ARRAY['https://picsum.photos/400?random=1']),
  
  -- Laptops under 1000 with 16GB
  ('LAP102', 'Lenovo ThinkPad E14', 2, 'Lenovo', 'Durable business laptop with 16GB RAM.', 950.00, 4.6, 20, '{"ramGb": 16, "cpu": "Ryzen 7"}', ARRAY['https://picsum.photos/400?random=2']),
  ('LAP103', 'Acer Swift 3', 2, 'Acer', 'Lightweight ultrabook. 16GB RAM.', 799.00, 4.2, 15, '{"ramGb": 16, "cpu": "Core i5"}', ARRAY['https://picsum.photos/400?random=3']),
  ('LAP104', 'Asus TUF Gaming', 2, 'Asus', 'Entry gaming with dedicated GPU, great for AI. 16GB RAM.', 999.00, 4.7, 5, '{"ramGb": 16, "gpu": "RTX 3050"}', ARRAY['https://picsum.photos/400?random=4']),
  ('LAP105', 'HP Pavilion 15', 2, 'HP', 'Affordable multimedia laptop with 16GB RAM.', 849.00, 4.3, 30, '{"ramGb": 16, "cpu": "Ryzen 5"}', ARRAY['https://picsum.photos/400?random=5']),
  
  -- Budget 8GB Laptops
  ('LAP201', 'Lenovo IdeaPad 3', 2, 'Lenovo', 'Basic daily driver.', 450.00, 4.0, 100, '{"ramGb": 8}', ARRAY['https://picsum.photos/400?random=6']),
  ('LAP202', 'Acer Aspire 5', 2, 'Acer', 'Great for students.', 550.00, 4.1, 80, '{"ramGb": 8}', ARRAY['https://picsum.photos/400?random=7']),
  
  -- Premium Laptops
  ('LAP301', 'MacBook Pro 16', 2, 'Apple', 'Top tier performance.', 2499.00, 4.9, 25, '{"ramGb": 32, "cpu": "M3 Max"}', ARRAY['https://picsum.photos/400?random=8']),
  ('LAP302', 'Dell XPS 15', 2, 'Dell', 'Premium windows ultrabook.', 1899.00, 4.8, 12, '{"ramGb": 32, "cpu": "Core i9"}', ARRAY['https://picsum.photos/400?random=9']),
  ('LAP303', 'Razer Blade 15', 2, 'Razer', 'High-end gaming.', 2299.00, 4.7, 8, '{"ramGb": 16, "gpu": "RTX 4070"}', ARRAY['https://picsum.photos/400?random=10']),
  
  -- Out of stock laptop
  ('LAP401', 'Framework Laptop 13', 2, 'Framework', 'Modular and repairable.', 1049.00, 4.8, 0, '{"ramGb": 16}', ARRAY['https://picsum.photos/400?random=11']),
  
  -- Smartphones
  ('PHN101', 'iPhone 15 Pro', 3, 'Apple', 'Titanium design.', 999.00, 4.8, 40, '{}', ARRAY['https://picsum.photos/400?random=12']),
  ('PHN102', 'Galaxy S24 Ultra', 3, 'Samsung', 'AI features.', 1199.00, 4.9, 30, '{}', ARRAY['https://picsum.photos/400?random=13']),
  ('PHN103', 'Pixel 8 Pro', 3, 'Google', 'Best camera.', 899.00, 4.7, 2, '{}', ARRAY['https://picsum.photos/400?random=14']), -- low stock
  ('PHN104', 'OnePlus 12', 3, 'OnePlus', 'Fast charging.', 799.00, 4.6, 50, '{}', ARRAY['https://picsum.photos/400?random=15']),
  ('PHN105', 'Nothing Phone 2', 3, 'Nothing', 'Glyph interface.', 599.00, 4.5, 10, '{}', ARRAY['https://picsum.photos/400?random=16']),
  
  -- Audio
  ('AUD101', 'Sony WH-1000XM5', 4, 'Sony', 'Noise cancelling.', 348.00, 4.8, 60, '{}', ARRAY['https://picsum.photos/400?random=17']),
  ('AUD102', 'AirPods Pro 2', 4, 'Apple', 'Seamless integration.', 249.00, 4.9, 100, '{}', ARRAY['https://picsum.photos/400?random=18']),
  ('AUD103', 'Sennheiser Momentum 4', 4, 'Sennheiser', 'Audiophile sound.', 329.00, 4.6, 15, '{}', ARRAY['https://picsum.photos/400?random=19']),
  ('AUD104', 'Bose QuietComfort', 4, 'Bose', 'Comfortable ANC.', 299.00, 4.7, 3, '{}', ARRAY['https://picsum.photos/400?random=20']), -- low stock
  
  -- Shoes
  ('SHO101', 'Nike Air Max', 6, 'Nike', 'Running shoes.', 120.00, 4.5, 80, '{}', ARRAY['https://picsum.photos/400?random=21']),
  ('SHO102', 'Adidas Ultraboost', 6, 'Adidas', 'Comfortable sneakers.', 140.00, 4.6, 70, '{}', ARRAY['https://picsum.photos/400?random=22']),
  ('SHO103', 'Puma RS-X', 6, 'Puma', 'Chunky retro style.', 110.00, 4.4, 40, '{}', ARRAY['https://picsum.photos/400?random=23']),
  ('SHO104', 'New Balance 990', 6, 'New Balance', 'Classic dad shoe.', 185.00, 4.7, 12, '{}', ARRAY['https://picsum.photos/400?random=24']),
  ('SHO105', 'Converse Chuck Taylor', 6, 'Converse', 'Timeless canvas.', 60.00, 4.8, 0, '{}', ARRAY['https://picsum.photos/400?random=25']), -- out of stock
  
  -- Clothing
  ('CLO101', 'Levi 501 Jeans', 7, 'Levis', 'Classic straight fit.', 70.00, 4.7, 100, '{}', ARRAY['https://picsum.photos/400?random=26']),
  ('CLO102', 'North Face Fleece', 7, 'North Face', 'Warm winter layer.', 99.00, 4.8, 45, '{}', ARRAY['https://picsum.photos/400?random=27']),
  ('CLO103', 'Patagonia T-Shirt', 7, 'Patagonia', 'Organic cotton.', 45.00, 4.6, 200, '{}', ARRAY['https://picsum.photos/400?random=28']),
  ('CLO104', 'Uniqlo Airism', 7, 'Uniqlo', 'Breathable undershirt.', 15.00, 4.9, 500, '{}', ARRAY['https://picsum.photos/400?random=29']),
  ('CLO105', 'ArcTeryx Shell', 7, 'ArcTeryx', 'Waterproof jacket.', 350.00, 4.9, 4, '{}', ARRAY['https://picsum.photos/400?random=30']), -- low stock
  
  -- Books
  ('BOK101', 'Dune', 8, 'Penguin', 'Sci-fi classic.', 10.00, 4.8, 30, '{}', ARRAY['https://picsum.photos/400?random=31']),
  ('BOK102', 'Project Hail Mary', 8, 'Random House', 'Space survival.', 15.00, 4.9, 40, '{}', ARRAY['https://picsum.photos/400?random=32']),
  ('BOK103', 'Atomic Habits', 8, 'Penguin', 'Self-improvement.', 12.00, 4.7, 150, '{}', ARRAY['https://picsum.photos/400?random=33']),
  ('BOK104', 'The Pragmatic Programmer', 8, 'Addison-Wesley', 'Coding best practices.', 40.00, 4.9, 25, '{}', ARRAY['https://picsum.photos/400?random=34']),
  ('BOK105', 'Clean Code', 8, 'Prentice Hall', 'Writing better software.', 35.00, 4.6, 2, '{}', ARRAY['https://picsum.photos/400?random=35']) -- low stock
ON CONFLICT DO NOTHING;

-- Seeded Orders (prime@demo.com: DELIVERED with LAP101, SHIPPED, PLACED; basic@demo.com: SHIPPED)
INSERT INTO orders (id, user_id, status, total, shipping_estimate, created_at) VALUES
  ('ORD-000001', '22222222-2222-2222-2222-222222222222', 'DELIVERED', 899.00, 0.00, NOW() - INTERVAL '5 days'),
  ('ORD-000002', '22222222-2222-2222-2222-222222222222', 'SHIPPED', 450.00, 0.00, NOW() - INTERVAL '2 days'),
  ('ORD-000003', '22222222-2222-2222-2222-222222222222', 'PLACED', 120.00, 0.00, NOW() - INTERVAL '1 hour'),
  ('ORD-000004', '11111111-1111-1111-1111-111111111111', 'SHIPPED', 950.00, 0.00, NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  ('ORD-000001', 'LAP101', 1, 899.00),
  ('ORD-000002', 'LAP201', 1, 450.00),
  ('ORD-000003', 'SHO101', 1, 120.00),
  ('ORD-000004', 'LAP102', 1, 950.00)
ON CONFLICT DO NOTHING;

-- Mock events for these orders to ensure the API resolves their status correctly
INSERT INTO order_events (order_id, status, note, event_time) VALUES
  -- ORD-1 (DELIVERED)
  ('ORD-000001', 'PLACED', 'Order placed successfully', NOW() - INTERVAL '5 days'),
  ('ORD-000001', 'PACKED', 'Order packed', NOW() - INTERVAL '4 days 23 hours'),
  ('ORD-000001', 'SHIPPED', 'Order shipped', NOW() - INTERVAL '4 days 18 hours'),
  ('ORD-000001', 'OUT_FOR_DELIVERY', 'Order out for delivery', NOW() - INTERVAL '4 days'),
  ('ORD-000001', 'DELIVERED', 'Order delivered', NOW() - INTERVAL '3 days 18 hours'),
  
  -- ORD-2 (SHIPPED)
  ('ORD-000002', 'PLACED', 'Order placed successfully', NOW() - INTERVAL '2 days'),
  ('ORD-000002', 'PACKED', 'Order packed', NOW() - INTERVAL '1 day 23 hours'),
  ('ORD-000002', 'SHIPPED', 'Order shipped', NOW() - INTERVAL '1 day 18 hours'),
  
  -- ORD-3 (PLACED)
  ('ORD-000003', 'PLACED', 'Order placed successfully', NOW() - INTERVAL '1 hour'),
  
  -- ORD-4 (SHIPPED)
  ('ORD-000004', 'PLACED', 'Order placed successfully', NOW() - INTERVAL '3 days'),
  ('ORD-000004', 'PACKED', 'Order packed', NOW() - INTERVAL '2 days 23 hours'),
  ('ORD-000004', 'SHIPPED', 'Order shipped', NOW() - INTERVAL '2 days 18 hours')
ON CONFLICT DO NOTHING;
