/**
 * @typedef {Object} InvoiceDTO
 * @property {number} id
 * @property {string} issueDate
 * @property {string} dueDate
 * @property {string} status
 * @property {number} customerId
 * @property {number} totalAmountExVat
 * @property {number} vatAmount
 * @property {number} totalAmountIncVat
 * @property {string} currencyCode
 */

/**
 * @typedef {Object} CreateInvoiceItemDTO
 * @property {number} productId
 * @property {string} description
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} vatRate
 * @property {number} totalPrice
 */

/**
 * @typedef {Object} CreateInvoiceDTO
 * @property {string} issueDate
 * @property {string} dueDate
 * @property {number} customerId
 * @property {number} totalAmountExVat
 * @property {number} vatAmount
 * @property {number} totalAmountIncVat
 * @property {string} currencyCode
 * @property {string} status
 * @property {Array<CreateInvoiceItemDTO>} items
 */

/**
 * @typedef {Object} UpdateInvoiceDTO
 * @property {string} [issueDate]
 * @property {string} [dueDate]
 * @property {string} [status]
 * @property {number} [totalAmountExVat]
 * @property {number} [vatAmount]
 * @property {number} [totalAmountIncVat]
 * @property {string} [currencyCode]
 */

/**
 * @typedef {Object} InvoiceItemDTO
 * @property {number} id
 * @property {number} invoiceId
 * @property {number} productId
 * @property {string} description
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} vatRate
 * @property {number} totalPrice
 */

/**
 * @typedef {Object} InvoiceItemDetailDTO
 * @property {number} id
 * @property {number} invoiceId
 * @property {number} productId
 * @property {string} description
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} vatRate
 * @property {number} totalPrice
 * @property {Object} [product]
 */

/**
 * @typedef {Object} InvoiceDetailDTO
 * @property {number} id
 * @property {string} issueDate
 * @property {string} dueDate
 * @property {string} status
 * @property {number} customerId
 * @property {number} totalAmountExVat
 * @property {number} vatAmount
 * @property {number} totalAmountIncVat
 * @property {string} currencyCode
 * @property {Object} [customer]
 * @property {Array<InvoiceItemDetailDTO>} items
 */

export {};
