import path from "path";
import fs from "fs";

export async function GET() {
  try {
    // Define the path to your JSON file
    const filePath = path.join(process.cwd(), "src/data/wilayaData.json");

    // Read the file as-is (no parsing)
    const fileData = fs.readFileSync(filePath, "utf-8");

    return new Response(fileData, {
      status: 200,
      headers: {
        "Content-Type": "application/json", // Ensure the response is treated as JSON
      },
    });
  } catch (error) {
    console.error("Error fetching wilaya data:", error);

    // Return a generic error message for unknown errors
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
