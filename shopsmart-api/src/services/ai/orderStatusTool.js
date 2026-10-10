import { getOrderStatusForUser } from '../orderService.js';

export const extractOrderId = (message) => {
  const match = message.match(/ORD-\d+/i);
  if (match) return match[0].toUpperCase();
  return null;
};

export const handleOrderStatus = async (userId, message) => {
  try {
    const orderId = extractOrderId(message);
    const orderData = await getOrderStatusForUser(userId, orderId);
    
    if (!orderData) {
      return {
        answer: "I could not find an active order for your account.",
        orderId: orderId,
        latestEvent: null
      };
    }
    
    let reply = `Order ${orderData.orderId} is currently ${orderData.status}.`;
    
    if (orderData.latestEvent) {
      reply += ` Latest update: ${orderData.latestEvent.status} at ${new Date(orderData.latestEvent.eventTime || orderData.latestEvent.createdAt).toLocaleString()}.`;
    }
    
    if (orderData.items && orderData.items.length > 0) {
      reply += `nItems in this order:`;
      orderData.items.forEach(item => {
        reply += `n- ${item.quantity}x ${item.productName} ($${item.unitPrice})`;
      });
    }
    
    return {
      answer: reply,
      orderId: orderData.orderId,
      latestEvent: orderData.latestEvent?.status || orderData.status
    };
  } catch (err) {
    if (err.statusCode === 404) {
      return { answer: "I could not find an active order with that ID.", orderId: null, latestEvent: null };
    }
    return { answer: "I'm sorry, I couldn't retrieve your order status at the moment.", orderId: null, latestEvent: null };
  }
};
