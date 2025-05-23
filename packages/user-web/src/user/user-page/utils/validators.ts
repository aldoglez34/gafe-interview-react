// these are all very basic validations, we can make them more specific or create more in the future

const isEmpty = (value: string) => {
  return (!value || value.trim() === "")
}

const isValidString = (value: string) => {
  if (isEmpty(value)) {
    return "This field is required"
  }
}

const isValidEmail = (value: string) => {
  if (isEmpty(value)) {
    return "This field is required"
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "This is not a valid email address"
  }
}

const isValidPhoneNumber = (value: string) => {
  if (value.length !== 0 && !/^\+1-\d{3}-\d{3}-\d{4}$/.test(value)) {
    return "This is not a valid phone number";
  }
};

export default { isValidEmail, isValidPhoneNumber, isValidString }