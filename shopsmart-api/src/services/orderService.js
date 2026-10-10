import { query, transaction } from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { getCart } from './cartService.js';

export const generateMockEvents = (status, createdAt = new Date()) => {
  const events = [];
  const baseTime = new Date(createdAt).getTime();
  
  const offsets = {
    'PACKED': 1 * 60 * 60 * 1000,
    'SHIPPED': 6 * 60 * 60 * 1000,
    'OUT_FOR_DELIVERY': 24 * 60 * 60 * 1000,
    'DELIVERED': 30 * 60 * 60 * 1000
  };

  const allStatuses = ['PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  events.push({ status: 'PLACED', note: 'Order placed successfully', eventTime: new Date(baseTime).toISOString() });
  
  if (status === 'PLACED') {
    allStatuses.forEach(s => {
      events.push({ status: s, note: `Order ${s.toLowerCase()}`, eventTime: new Date(baseTime + offsets[s]).toISOString() });
    });
  }

  return events;
};

export const getOrderById = async (orderId, userId, isAdmin = false) => {
  const orderRes = await query(`
    SELECT id, user_id, status, total, shipping_estimate as "shippingEstimate", created_at as "createdAt"
    FROM orders WHERE id = $1
  `, [orderId]);

  if (orderRes.rows.length === 0) throw new AppError('Order not found', 404);
  const order = orderRes.rows[0];

  if (!isAdmin && order.user_id !== userId) {
    throw new AppError('Order not found', 404);
  }

  const itemsRes = await query(`
    SELECT o.product_id as "productId", p.name, o.quantity, o.unit_price as "unitPrice"
    FROM order_items o
    JOIN products p ON o.product_id = p.id
    WHERE o.order_id = $1
  `, [orderId]);

  const eventsRes = await query(`
    SELECT status, note, event_time as "eventTime"
    FROM order_events
    WHERE order_id = $1 AND event_time <= NOW()
    ORDER BY event_time ASC
  `, [orderId]);

  const status = eventsRes.rows.length > 0 ? eventsRes.rows[eventsRes.rows.length - 1].status : order.status;

  const { user_id, ...orderData } = order;
  return {
    ...orderData,
    status,
    items: itemsRes.rows,
    events: eventsRes.rows
  };
};

export const placeOrder = async (userId, userTier) => {
  let createdOrderId = null;
  await transaction(async (client) => {
    const cart = await getCart(userId, userTier);
    if (cart.items.length === 0) {
      throw new AppError('Cart is empty', 409);
    }

    const productIds = cart.items.map(i => i.productId);
    const lockedProducts = await client.query(`SELECT id, stock_qty FROM products WHERE id = ANY($1) FOR UPDATE`, [productIds]);
    const stockMap = {};
    lockedProducts.rows.forEach(p => stockMap[p.id] = p.stock_qty);

    for (const item of cart.items) {
      const available = stockMap[item.productId];
      if (available === undefined || available < item.quantity) {
        throw new AppError(`Insufficient stock for product ${item.productId}`, 409, [{ field: item.productId, message: `Only ${available || 0} left in stock` }]);
      }
    }

    for (const item of cart.items) {
      await client.query(`UPDATE products SET stock_qty = stock_qty - $1 WHERE id = $2`, [item.quantity, item.productId]);
    }

    const { total, shippingEstimate } = cart;
    const orderRes = await client.query(`
      INSERT INTO orders (user_id, status, total, shipping_estimate)
      VALUES ($1, $2, $3, $4) RETURNING id
    `, [userId, 'PLACED', total, shippingEstimate]);
    
    const orderId = orderRes.rows[0].id;
    createdOrderId = orderId;

    for (const item of cart.items) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.productId, item.quantity, item.unitPrice]);
    }

    await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);

    const events = generateMockEvents('PLACED', new Date());
    for (const ev of events) {
      await client.query(`
        INSERT INTO order_events (order_id, status, note, event_time)
        VALUES ($1, $2, $3, $4)
      `, [orderId, ev.status, ev.note, ev.eventTime]);
    }
  });

  return getOrderById(createdOrderId, userId);
};

export const getOrders = async (userId, page = 1, size = 12) => {
  const limit = Math.min(parseInt(size) || 12, 50);
  const offset = (Math.max(parseInt(page) || 1, 1) - 1) * limit;

  const countRes = await query(`SELECT COUNT(*) FROM orders WHERE user_id = $1`, [userId]);
  const totalItems = parseInt(countRes.rows[0].count);

  const res = await query(`
    SELECT o.id, o.status, o.total, o.created_at as "createdAt",
           (SELECT COALESCE(SUM(quantity), 0) FROM order_items WHERE order_id = o.id) as "itemCount"
    FROM orders o
    WHERE o.user_id = $1
    ORDER BY o.created_at DESC
    LIMIT $2 OFFSET $3
  `, [userId, limit, offset]);

  const items = [];
  for (const row of res.rows) {
    const ev = await query(`SELECT status FROM order_events WHERE order_id = $1 AND event_time <= NOW() ORDER BY event_time DESC LIMIT 1`, [row.id]);
    const currentStatus = ev.rows.length > 0 ? ev.rows[0].status : row.status;
    items.push({ ...row, status: currentStatus, itemCount: parseInt(row.itemCount) });
  }

  return {
    items,
    page: parseInt(page) || 1,
    totalPages: Math.ceil(totalItems / limit),
    totalItems
  };
};

export const getOrderStatusForUser = async (userId, orderId = null) => {
  let q = `SELECT id FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`;
  let params = [userId];

  if (orderId) {
    q = `SELECT id FROM orders WHERE user_id = $1 AND id = $2`;
    params.push(orderId);
  }

  const res = await query(q, params);
  if (res.rows.length === 0) return null;

  return getOrderById(res.rows[0].id, userId);
};
