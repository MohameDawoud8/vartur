import * as Yup from "yup";
import { badRequest } from "@/lib/errorHandler";

export type ValidationSchema = Yup.ObjectSchema<Yup.AnyObject>;

export async function validateData<T>(
  data: unknown,
  schema: ValidationSchema,
  options: Yup.ValidateOptions = { abortEarly: false }
): Promise<T> {
  try {
    return (await schema.validate(data, options)) as T;
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      badRequest("Validation Error", error.errors);
    }
    throw error;
  }
}

export function createValidator<T>(schema: ValidationSchema) {
  return (data: unknown) => validateData<T>(data, schema);
}
