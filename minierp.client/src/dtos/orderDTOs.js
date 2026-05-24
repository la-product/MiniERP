/**
 * @typedef {Object} OrderDTO
 * @property {number} id
 * @property {number} customerId
 * @property {string} [shipping]
 * @property {string} [payment]
 * @property {string} createdAt
 * @property {number} totalPrice
 * @property {string} [note]
 * @property {string} status
 */

/**
 * @typedef {Object} CreateOrderItemDTO
 * @property {number} productId
 * @property {number} quantity
 * @property {number} unitPrice
 */

/**
 * @typedef {Object} CreateOrderDTO
 * @property {number} customerId
 * @property {string} [shipping]
 * @property {string} [payment]
 * @property {number} totalPrice
 * @property {string} [note]
 * @property {string} status
 * @property {Array<CreateOrderItemDTO>} items
 */

/**
 * @typedef {Object} UpdateOrderDTO
 * @property {string} [shipping]
 * @property {string} [payment]
 * @property {number} [totalPrice]
 * @property {string} [note]
 * @property {string} [status]
 */

/**
 * @typedef {Object} OrderItemDTO
 * @property {number} id
 * @property {number} orderId
 * @property {number} productId
 * @property {number} quantity
 * @property {number} unitPrice
 */

/**
 * @typedef {Object} OrderItemDetailDTO
 * @property {number} id
 * @property {number} orderId
 * @property {number} productId
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {Object} [product]
 */

/**
 * @typedef {Object} OrderDetailDTO
 * @property {number} id
 * @property {number} customerId
 * @property {string} [shipping]
 * @property {string} [payment]
 * @property {string} createdAt
 * @property {number} totalPrice
 * @property {string} [note]
 * @property {string} status
 * @property {Object} [customer]
 * @property {Array<OrderItemDetailDTO>} items
 */

export {};
