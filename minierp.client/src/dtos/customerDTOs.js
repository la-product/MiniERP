/**
 * @typedef {Object} CustomerDTO
 * @property {number} id
 * @property {string} name
 * @property {string} street
 * @property {string} city
 * @property {string} zip
 * @property {string} email
 * @property {string} phone
 */

/**
 * @typedef {Object} CreateCustomerDTO
 * @property {string} name
 * @property {string} street
 * @property {string} city
 * @property {string} zip
 * @property {string} email
 * @property {string} phone
 */

/**
 * @typedef {Object} UpdateCustomerDTO
 * @property {string} [name]
 * @property {string} [street]
 * @property {string} [city]
 * @property {string} [zip]
 * @property {string} [email]
 * @property {string} [phone]
 */

/**
 * @typedef {Object} CustomerDetailDTO
 * @property {number} id
 * @property {string} name
 * @property {string} street
 * @property {string} city
 * @property {string} zip
 * @property {string} email
 * @property {string} phone
 * @property {Array} orders
 */

export {};
