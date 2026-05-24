/**
 * Mapuje ProductDTO na formát vhodný pro editaci
 * @param {Object} productDto
 * @returns {Object}
 */
export const mapProductDtoToForm = (productDto) => {
  return {
    id: productDto.id || "",
    size: productDto.size || "",
    brand: productDto.brand || "",
    pattern: productDto.pattern || "",
    si: productDto.si || "",
    li: productDto.li || "",
    netPrice: productDto.netPrice || "",
    stock: productDto.stock || "",
  };
};

/**
 * Mapuje formulář na CreateProductDTO
 * @param {Object} formData
 * @returns {Object}
 */
export const mapFormToCreateProductDto = (formData) => {
  return {
    size: formData.size,
    brand: formData.brand,
    pattern: formData.pattern,
    si: parseInt(formData.si) || 0,
    li: formData.li,
    netPrice: parseFloat(formData.netPrice) || 0,
    stock: parseInt(formData.stock) || 0,
  };
};

/**
 * Mapuje formulář na UpdateProductDTO (pouze vyplněná pole)
 * @param {Object} formData
 * @returns {Object}
 */
export const mapFormToUpdateProductDto = (formData) => {
  const dto = {};

  if (formData.size) dto.size = formData.size;
  if (formData.brand) dto.brand = formData.brand;
  if (formData.pattern) dto.pattern = formData.pattern;
  if (formData.si) dto.si = parseInt(formData.si);
  if (formData.li) dto.li = formData.li;
  if (formData.netPrice) dto.netPrice = parseFloat(formData.netPrice);
  if (formData.stock !== "") dto.stock = parseInt(formData.stock);

  return dto;
};

/**
 * Vrátí display text produktu
 * @param {Object} product
 * @returns {string}
 */
export const getProductDisplayText = (product) => {
  return `${product.size || ""} ${product.brand || ""} ${product.pattern || ""}`.trim();
};
