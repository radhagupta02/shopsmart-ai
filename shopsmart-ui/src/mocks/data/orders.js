/**
 * Mock orders dataset per CONTRACT Section 44, 54, 60.
 * prime@demo.com: 1 DELIVERED (LAP101), 1 SHIPPED, 1 PLACED
 * basic@demo.com: 1 SHIPPED
 */

export const INITIAL_ORDERS = [
  {
    id: 'ORD-100001',
    userId: 'usr_prime',
    status: 'DELIVERED',
    total: 899.00,
    shippingEstimate: 0.00,
    itemCount: 1,
    createdAt: '2026-10-01T10:00:00Z',
    items: [
      {
        productId: 'LAP101',
        name: 'Dell Inspiron 15',
        quantity: 1,
        unitPrice: 899.00,
      },
    ],
    events: [
      { status: 'PLACED', note: 'Order placed successfully', eventTime: '2026-10-01T10:00:00Z' },
      { status: 'PACKED', note: 'Order packed at logistics center', eventTime: '2026-10-01T14:30:00Z' },
      { status: 'SHIPPED', note: 'Order shipped with carrier', eventTime: '2026-10-02T08:00:00Z' },
      { status: 'OUT_FOR_DELIVERY', note: 'Courier out for delivery', eventTime: '2026-10-03T09:15:00Z' },
      { status: 'DELIVERED', note: 'Delivered to recipient', eventTime: '2026-10-03T13:45:00Z' },
    ],
  },
  {
    id: 'ORD-100002',
    userId: 'usr_prime',
    status: 'SHIPPED',
    total: 399.00,
    shippingEstimate: 0.00,
    itemCount: 1,
    createdAt: '2026-10-08T09:00:00Z',
    items: [
      {
        productId: 'AUD301',
        name: 'Sony WH-1000XM5',
        quantity: 1,
        unitPrice: 399.00,
      },
    ],
    events: [
      { status: 'PLACED', note: 'Order placed successfully', eventTime: '2026-10-08T09:00:00Z' },
      { status: 'PACKED', note: 'Order packed at logistics center', eventTime: '2026-10-08T15:00:00Z' },
      { status: 'SHIPPED', note: 'In transit to distribution hub', eventTime: '2026-10-09T07:30:00Z' },
    ],
  },
  {
    id: 'ORD-100003',
    userId: 'usr_prime',
    status: 'PLACED',
    total: 45.00,
    shippingEstimate: 0.00,
    itemCount: 1,
    createdAt: '2026-10-10T11:00:00Z',
    items: [
      {
        productId: 'BOK501',
        name: 'Designing Data-Intensive Applications',
        quantity: 1,
        unitPrice: 45.00,
      },
    ],
    events: [
      { status: 'PLACED', note: 'Order placed, awaiting processing', eventTime: '2026-10-10T11:00:00Z' },
    ],
  },
  {
    id: 'ORD-100004',
    userId: 'usr_basic',
    status: 'SHIPPED',
    total: 130.00,
    shippingEstimate: 0.00,
    itemCount: 1,
    createdAt: '2026-10-07T14:20:00Z',
    items: [
      {
        productId: 'SHN401',
        name: 'Nike Air Zoom Pegasus 40',
        quantity: 1,
        unitPrice: 130.00,
      },
    ],
    events: [
      { status: 'PLACED', note: 'Order placed successfully', eventTime: '2026-10-07T14:20:00Z' },
      { status: 'PACKED', note: 'Order packed at warehouse', eventTime: '2026-10-07T18:00:00Z' },
      { status: 'SHIPPED', note: 'Dispatched with standard courier', eventTime: '2026-10-08T08:30:00Z' },
    ],
  },
];

let mockOrders = [...INITIAL_ORDERS];
let orderSequence = 100005;

/**
 * Returns list item format:
 * { id, status, total, createdAt, itemCount }
 */
export function toOrderListItem(order) {
  return {
    id: order.id,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    itemCount: order.itemCount,
  };
}

/**
 * Returns detail format:
 * list item + { shippingEstimate, items, events }
 */
export function toOrderDetail(order) {
  return {
    id: order.id,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    itemCount: order.itemCount,
    shippingEstimate: order.shippingEstimate,
    items: order.items.map((i) => ({
      productId: i.productId,
      name: i.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
    events: order.events.map((e) => ({
      status: e.status,
      note: e.note,
      eventTime: e.eventTime,
    })),
  };
}

export function listUserOrders(userId) {
  // If specific userId provided, filter; otherwise return prime demo orders by default
  const filtered = userId
    ? mockOrders.filter((o) => o.userId === userId)
    : mockOrders.filter((o) => o.userId === 'usr_prime');
  return filtered.map(toOrderListItem);
}

export function getOrderById(orderId) {
  const order = mockOrders.find((o) => o.id === orderId);
  return order ? toOrderDetail(order) : null;
}

export function createOrderFromCart(cartState, user) {
  if (!cartState.items.length) {
    const err = new Error('Cart is empty');
    err.status = 409;
    throw err;
  }

  const orderId = `ORD-${orderSequence++}`;
  const now = new Date().toISOString();

  const order = {
    id: orderId,
    userId: user?.id || 'usr_prime',
    status: 'PLACED',
    total: cartState.total,
    shippingEstimate: cartState.shippingEstimate,
    itemCount: cartState.items.reduce((sum, i) => sum + i.quantity, 0),
    createdAt: now,
    items: cartState.items.map((i) => ({
      productId: i.productId,
      name: i.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
    events: [
      { status: 'PLACED', note: 'Order placed successfully', eventTime: now },
    ],
  };

  mockOrders.unshift(order);
  return toOrderDetail(order);
}
