import * as Yup from "yup";
import { createValidator } from "../utils/validator.util";

export const createProductSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  picture: Yup.string()
    .optional()
    .matches(
      /^data:image\/(png|jpg|jpeg|gif);base64,([A-Za-z0-9+/=]+)$/,
      "Picture must be a valid base64 string"
    ),
  categoryId: Yup.number()
    .required("Category ID is required")
    .positive("Category ID must be a positive integer"),
});

export const updateProductSchema = Yup.object()
  .shape({
    name: Yup.string(),
    picture: Yup.string().optional(),
    categoryId: Yup.number()
      .optional()
      .positive("Category ID must be a positive integer"),
  })
  .test(
    "at-least-one-field",
    "At least one field must be provided for update",
    (value) => {
      return Object.keys(value).length > 0;
    }
  );

export type CreateProductInput = Yup.InferType<typeof createProductSchema>;
export type UpdateProductInput = Yup.InferType<typeof updateProductSchema>;

export const validateCreateProduct =
  createValidator<CreateProductInput>(createProductSchema);
export const validateUpdateProduct =
  createValidator<UpdateProductInput>(updateProductSchema);
