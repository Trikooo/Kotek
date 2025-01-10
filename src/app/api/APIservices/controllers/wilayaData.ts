import path from "path";
import fs from "fs";

// Controller function to get wilaya data
export function getWilayaData() {
  // Define the path to your JSON file
  const filePath = path.join(process.cwd(), "src/data/wilayaData.json");

  // Read the file as-is (no parsing)
  const fileData = fs.readFileSync(filePath, "utf-8");

  return fileData;
}
