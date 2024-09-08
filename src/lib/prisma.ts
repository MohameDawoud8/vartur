import { PrismaClient } from "@prisma/client";

class EnhancedPrismaClient extends PrismaClient {
  private static instance: PrismaClient;
  private isConnected: boolean = false;

  private constructor() {
    const logLevels =
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["warn", "error"];

    super({
      log: logLevels,
      errorFormat: "pretty",
    });
  }

  public static getInstance(): PrismaClient {
    if (!EnhancedPrismaClient.instance) {
      EnhancedPrismaClient.instance = new EnhancedPrismaClient();
    }

    return EnhancedPrismaClient.instance;
  }
}

// Export the enhanced Prisma instance
const prisma = EnhancedPrismaClient.getInstance();
export default prisma;

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.disconnect();
});
