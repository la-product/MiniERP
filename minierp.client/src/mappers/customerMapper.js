/**
 * Mapuje CustomerDTO naformát vhodný pro editaci
 * @param {Object} customerDto
 * @returns {Object}
 */
export const mapCustomerDtoToForm = (customerDto) => {
  return {
    id: customerDto.id || "",
    name: customerDto.name || "",
    email: customerDto.email || "",
    street: customerDto.street || "",
    city: customerDto.city || "",
    zip: customerDto.zip || "",
    phone: customerDto.phone || "",
  };
};

/**
 * Mapuje formulář na CreateCustomerDTO
 * @param {Object} formData
 * @returns {Object}
 */
export const mapFormToCreateCustomerDto = (formData) => {
  return {
    name: formData.name,
    email: formData.email,
    street: formData.street,
    city: formData.city,
    zip: formData.zip,
    phone: formData.phone,
  };
};

/**
 * Mapuje formulář na UpdateCustomerDTO (pouze vyplněná pole)
 * @param {Object} formData
 * @returns {Object}
 */
export const mapFormToUpdateCustomerDto = (formData) => {
  const dto = {};

  if (formData.name) dto.name = formData.name;
  if (formData.email) dto.email = formData.email;
  if (formData.street) dto.street = formData.street;
  if (formData.city) dto.city = formData.city;
  if (formData.zip) dto.zip = formData.zip;
  if (formData.phone) dto.phone = formData.phone;

  return dto;
};
