# Full Stack Developer Assignment

This repository contains the implementation of a full stack assignment using the latest version of Next, Prisma for database migration, and MySQL as the database. The application provides CRUD functionality for categories and products with image resizing, tree view for categories, and dropdown selectors for parent categories.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Setup](#setup)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Image Processing](#image-processing)
6. [Error Handling](#error-handling)
7. [Frontend Features](#frontend-features)

## Project Structure

The project consists of the following main components:

- `schema.prisma`: Defines the database schema using Prisma ORM
- `route.ts` files: Implement API endpoints for categories and products
- Repositories: Handle database operations (not shown in the provided files)
- Validators: Validate input data (not shown in the provided files)
- Utility functions: Handle common tasks like image processing
- Frontend components: Render the UI, including the category tree with product counts and modal forms for creating categories and products

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Set up your MySQL database and update the `DATABASE_URL` in your environment variables.

3. Run Prisma migrations:

   ```
   npx prisma migrate dev
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Database Schema

The database consists of two main tables:

### Categories

- `id`: Int (Primary Key, Auto-increment)
- `name`: String
- `picture`: String (LongText, optional)
- `parentId`: Int (optional, self-relation)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Products

- `id`: Int (Primary Key, Auto-increment)
- `name`: String
- `picture`: String (LongText, optional)
- `categoryId`: Int (Foreign Key to Categories)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## API Endpoints

### Categories

- `GET /api/categories`: Fetch all categories
- `POST /api/categories`: Create a new category
- `GET /api/categories/[id]`: Fetch a specific category
- `PUT /api/categories/[id]`: Update a specific category
- `DELETE /api/categories/[id]`: Delete a specific category

### Products

- `GET /api/products`: Fetch all products
- `POST /api/products`: Create a new product
- `GET /api/products/[id]`: Fetch a specific product
- `PUT /api/products/[id]`: Update a specific product
- `DELETE /api/products/[id]`: Delete a specific product

## Image Processing

The project includes sophisticated image processing functionality for both categories and products. Images are stored as Base64-encoded strings in the database. When uploading an image, the `processImage` utility function in `processImage.ts` handles the image processing.

### Image Resizing

A key feature of the image processing is the ability to handle images of various sizes and standardize them to a target dimension of 3200x3200 pixels. This is done locally, without using any external services. Here's a detailed breakdown of how it works:

1. **Initial Processing**:

   - The function first prepares the input image for processing by converting the Base64 string to a format that can be manipulated.
   - It then analyzes the image to determine its original dimensions.

2. **Handling Larger Images** (width or height > 3200 pixels):

   - If the image exceeds 3200 pixels in either dimension, it's resized.
   - The resizing process maintains the original aspect ratio of the image.
   - The image is scaled down so that its larger dimension exactly fits 3200 pixels.
   - This ensures that the image quality is preserved as much as possible while reducing the file size.

3. **Handling Smaller Images** (both width and height <= 3200 pixels):

   - If the image is already smaller than or equal to 3200x3200 pixels, it's not resized.
   - The original image is used as is, preserving its original dimensions and quality.
   - This approach prevents unnecessary loss of quality that would occur if smaller images were enlarged.

4. **Final Processing**:

   - Regardless of whether the image was resized or not, a new 3200x3200 pixel transparent canvas is created.
   - The processed image (whether resized or original) is then placed at the center of this canvas.
   - For images that aren't square, this results in transparent margins on two sides.

5. **Output**:
   - The final image, now sitting on a 3200x3200 transparent canvas, is converted to PNG format.
   - It's then encoded back to a Base64 string, ready to be stored in the database.

This approach ensures several benefits:

- Larger images are downsized, improving performance and reducing storage requirements.
- Smaller images maintain their original quality, avoiding artificial enlargement and quality loss.
- All images end up with a consistent 3200x3200 dimension, simplifying frontend display logic.
- The use of a transparent canvas ensures that non-square images are displayed correctly without distortion.
- The centered placement of images within the canvas provides a consistent look across all uploaded images.

By implementing this image processing strategy, the application achieves a balance between maintaining image quality and ensuring consistency in image dimensions. This standardization simplifies image handling on the frontend while still preserving the integrity of the original images as much as possible.

[... rest of the README remains unchanged ...]

## Error Handling

The project uses a custom error handling middleware (`withErrorHandler`) to manage errors consistently across all API endpoints. Specific errors, such as `ImageProcessingError`, are implemented to provide more detailed error information.

## Frontend Features

### Category Tree with Product Counts

The project includes a `CategoryTreeTable` component that displays categories in a hierarchical structure. Key features include:

1. **Expandable/Collapsible Categories**: Categories with children can be expanded or collapsed using chevron icons.
2. **Recursive Product Count**: Each category displays the total count of products, including those in its subcategories.
3. **Indentation**: Child categories are visually indented to show the hierarchy.
4. **Delete Confirmation**: Each category has a delete option with a confirmation dialog.
5. **Loading State**: A skeleton loader is displayed while fetching category data.

### Create Category Modal

The `CreateCategoryModal` component provides a form for creating new categories. Key features include:

1. **Image Upload**: Users can upload a category image with preview functionality.
2. **Parent Category Selection**: A dropdown list allows users to select a parent category, displaying the full category hierarchy.
3. **Form Validation**: Yup schema validation ensures all required fields are filled correctly.

### Create Product Modal

The `CreateProductModal` component offers a form for creating new products. Key features include:

1. **Image Upload**: Similar to the category modal, users can upload a product image with preview.
2. **Category Selection**: A dropdown list displays top-level parent categories and their children recursively.
3. **Category Change Confirmation**: When changing the selected category, a confirmation modal appears to ensure intentional changes.
4. **Form Validation**: Yup schema validation ensures all required fields are filled correctly.

Both modals use React Hook Form for form management and Framer Motion for smooth animations. They also implement responsive design principles for a better user experience across different device sizes.

---

For more detailed information about each component, please refer to the individual files in the project.
