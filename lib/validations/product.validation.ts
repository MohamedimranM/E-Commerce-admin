import * as Yup from "yup";

export const productSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be at most 120 characters")
    .required("Product name is required"),
  brand: Yup.string()
    .min(1, "Brand is required")
    .required("Brand is required"),
  category: Yup.string()
    .min(1, "Category is required")
    .required("Category is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be negative")
    .required("Price is required"),
  countInStock: Yup.number()
    .typeError("Stock must be a number")
    .integer("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .required("Stock count is required"),
});
