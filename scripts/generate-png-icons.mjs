import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const svgPath = path.join(root, "public", "icons", "belle-app-icon.svg");
const svg = fs.readFileSync(svgPath);

await sharp(svg)
  .resize(180, 180, { fit: "fill" })
  .flatten({ background: "#f5a0bd" })
  .png()
  .toFile(path.join(root, "public", "apple-touch-icon.png"));
await sharp(svg)
  .resize(512, 512, { fit: "fill" })
  .flatten({ background: "#f5a0bd" })
  .png()
  .toFile(path.join(root, "public", "icon-512.png"));

console.log("Generated public/apple-touch-icon.png and public/icon-512.png");
