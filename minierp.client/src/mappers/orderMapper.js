/**
 * Mapuje OrderDTO na formát vhodný pro editaci
 * @param {Object} orderDto
 * @returns {Object}
 */
export const mapOrderDtoToForm = (orderDto) => {
  return {
    id: orderDto.id || "",
    customerId: orderDto.customerId || "",
    shipping: orderDto.shipping || "",
    payment: orderDto.payment || "",
    totalPrice: orderDto.totalPrice || "",
    note: orderDto.note || "",
    status: orderDto.status || "new",
  };
};

/**
 * Mapuje formulář a položky na CreateOrderDTO
 * @param {Object} formData
 * @param {Array} items
 * @returns {Object}
 */
export const mapFormToCreateOrderDto = (formData, items) => {
  return {
    customerId: parseInt(formData.customerId),
    shipping: formData.shipping,
    payment: formData.payment,
    totalPrice: items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    ),
    note: formData.note || "",
    status: formData.status || "new",
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };
};

/**
 * Mapuje formulář na UpdateOrderDTO
 * @param {Object} formData
 * @returns {Object}
 */
export const mapFormToUpdateOrderDto = (formData) => {
  const dto = {};

  if (formData.shipping) dto.shipping = formData.shipping;
  if (formData.payment) dto.payment = formData.payment;
  if (formData.totalPrice) dto.totalPrice = parseFloat(formData.totalPrice);
  if (formData.note) dto.note = formData.note;
  if (formData.status) dto.status = formData.status;

  return dto;
};

/**
 * Mapuje položku objednávky na OrderItemDTO
 * @param {Object} item
 * @returns {Object}
 */
export const mapFormItemToOrderItemDto = (item) => {
  return {
    productId: item.productId,
    quantity: parseInt(item.quantity) || 1,
    unitPrice: parseFloat(item.unitPrice) || 0,
  };
};
