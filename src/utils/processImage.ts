import { AppError, ErrorType } from "@/utils/errors";
import sharp from "sharp";

export async function processImage(
  base64Image: string,
  targetDimension: number = 3200
): Promise<string> {
  // Remove the data:image/[type];base64 prefix
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  // Get the metadata of the image
  const metadata = await sharp(buffer).metadata();

  if (!metadata.width || !metadata.height) {
    throw new AppError(
      400,
      ErrorType.VALIDATION,
      "Unable to determine image dimensions"
    );
  }

  let processedImageBuffer: Buffer;

  if (metadata.width > targetDimension || metadata.height > targetDimension) {
    // If the image is larger than the target, resize it
    const scaleFactor = Math.min(
      targetDimension / metadata.width,
      targetDimension / metadata.height
    );

    const newWidth = Math.round(metadata.width * scaleFactor);
    const newHeight = Math.round(metadata.height * scaleFactor);

    processedImageBuffer = await sharp(buffer)
      .resize(newWidth, newHeight, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // transparent background
      })
      .toBuffer();
  } else {
    // If the image is smaller, use it as is
    processedImageBuffer = buffer;
  }

  // Create a new image with the target dimensions and place the processed image in the center
  const finalImageBuffer = await sharp({
    create: {
      width: targetDimension,
      height: targetDimension,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: processedImageBuffer,
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();

  // Convert the final image back to base64
  return `data:image/png;base64,${finalImageBuffer.toString("base64")}`;
}
