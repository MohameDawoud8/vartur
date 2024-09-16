import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Base64 encoded colored squares for categories
const categoryImages = [
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgKDgofoCcn5AAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABrSURBVFjD7ZaxDYAwDAQvygaZAaagTMEOKWkoGSM7IKvAijHYAUFv+fW7+5/AtBHRiogHyD4MphORtYi88lj2Qbsxh6K+mzMAB6Q/fjDABJv1K5SeDuxABaYC1JNQSnBP4p6KlzQV+JgCnHJsHA5eCjPYAAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgKDgkFIaYekQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABrSURBVFjD7ZcxCgAhDEQfko2k8BoewZN5NS+wTSA/WFkFG9ddyFsMwxR5ZCbAfUQIYACHLCmlUkoZ9vFqtKcjfcVyAeAA1+0XBrjBZP0KpfcDO1CB2wLkl1BKcC7xnoqHNBX4mAKMzz85XpUbIrYAAAAASUVORK5CYII=",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgKDgk2HUv5bAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABpSURBVFjD7ZcxCgAhDEQfko1Y7DU8gifzal7ANiFkwcoqWGx2IV8Mb6bIN1UZ4IqI0AAd0GVIa22stY77eDbaLzH9xnIB4AD77yuDJxhsrlB6e2AHKvC0AKkC9QRzifVULKSpwF8VYAAtLR4Fz13o5QAAAABJRU5ErkJggg==",
];

// Base64 encoded product silhouettes
const productImages = [
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgKDgsXJy7gRQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABjSURBVFjD7ZexDcAwCASPwgbxDKmtpMwMjiCFi5jBIKtAsSXzkW2RqOBe+uqucI0xxl1Vd2Y+wL4cnHOKqp55PPtg3ZjD0X6aGYBf0i8EEECApzoQgfrkuLlvkHmUjBBA4MMCHO82Vg51Q4+/AAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgKDgwHaFPVaAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABxSURBVFjD7ZexDcAgDAQPJRtkBrfUlFkjGQIKL8EMRlaBA9vICjEfvcQR92dAFWOMS0QuZt4AbNlwzinM/Mxjbj99h0MG4AC7bbsQQAAB3tWBCHDkx8vt3+jrnUOG4W3Aqz8hteDRJc6pyDJKRggg8GEBG5AQO0F+NJZZAAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QgKDgwKq3TibAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAABuSURBVFjD7ZexDcAgDAQPJRtkBgoqCkYImQGKpGCTZIhvZIUYj17iiDsyoIoxxiUiNzNvALZsOOcUZn7nMbc/fYdDBuAAu227EEAAAb7VgQhw5MfL/R/0/c4hw/A14NWfkFrw6BLnVGQZJSMEEPixgAeZyTssTbFTPAAAAABJRU5ErkJggg==",
];

function getRandomImage(images: string[]): string {
  return images[Math.floor(Math.random() * images.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createCategory(name: string, parentId?: number) {
  return prisma.category.create({
    data: {
      name,
      picture: getRandomImage(categoryImages),
      parentId,
    },
  });
}

async function createProductsForCategory(categoryId: number, count: number) {
  const products = Array.from({ length: count }, (_, i) => ({
    name: `Product ${i + 1} in Category ${categoryId}`,
    picture: getRandomImage(productImages),
    categoryId,
  }));

  await prisma.product.createMany({ data: products });
}

async function main() {
  // Level 1 Categories
  const electronics = await createCategory("Electronics");
  const furniture = await createCategory("Furniture");
  const books = await createCategory("Books");

  // Level 2 Categories
  const computers = await createCategory("Computers", electronics.id);
  const smartphones = await createCategory("Smartphones", electronics.id);
  const livingRoom = await createCategory("Living Room", furniture.id);
  const bedroom = await createCategory("Bedroom", furniture.id);
  const fiction = await createCategory("Fiction", books.id);

  // Level 3 Categories
  const laptops = await createCategory("Laptops", computers.id);
  const desktops = await createCategory("Desktops", computers.id);
  const sciFi = await createCategory("Science Fiction", fiction.id);

  // Create products for each category
  const categories = [
    electronics,
    furniture,
    books,
    computers,
    smartphones,
    livingRoom,
    bedroom,
    fiction,
    laptops,
    desktops,
    sciFi,
  ];

  for (const category of categories) {
    const productCount = getRandomInt(3, 5);
    await createProductsForCategory(category.id, productCount);
    console.log(
      `Created ${productCount} products in category: ${category.name}`
    );
  }

  // Create a random nested category
  const randomParentId = categories[getRandomInt(0, categories.length - 1)].id;
  const randomCategory = await createCategory(
    "Random Category",
    randomParentId
  );
  const randomProductCount = getRandomInt(3, 5);
  await createProductsForCategory(randomCategory.id, randomProductCount);
  console.log(
    `Created random category with ${randomProductCount} products, parent ID: ${randomParentId}`
  );

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
