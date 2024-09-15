import * as Yup from "yup";
import { createValidator } from "../utils/validator.util";

export const createCategorySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  picture: Yup.string()
    .optional()
    .matches(
      /^data:image\/(png|jpg|jpeg|gif);base64,([A-Za-z0-9+/=]+)$/,
      "Picture must be a valid base64 string"
    ),
  parentId: Yup.number()
    .optional()
    .nullable()
    .positive("Parent ID must be a positive integer"),
});

export const updateCategorySchema = Yup.object()
  .shape({
    name: Yup.string(),
    picture: Yup.string().optional(),
    parentId: Yup.number()
      .optional()
      .positive("Parent ID must be a positive integer"),
  })
  .test(
    "at-least-one-field",
    "At least one field must be provided for update",
    (value) => {
      return Object.keys(value).length > 0;
    }
  );

export type CreateCategoryInput = Yup.InferType<typeof createCategorySchema>;
export type UpdateCategoryInput = Yup.InferType<typeof updateCategorySchema>;

export const validateCreateCategory =
  createValidator<CreateCategoryInput>(createCategorySchema);
export const validateUpdateCategory =
  createValidator<UpdateCategoryInput>(updateCategorySchema);
