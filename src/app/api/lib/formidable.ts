import formidable from "formidable";
import { IncomingMessage } from "http";
import path from "path";

interface ParsedFormData {
  fields: { [key: string]: any };
  files: { [key: string]: any };
}

export default function parseForm(req: IncomingMessage): Promise<ParsedFormData> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: path.join(process.cwd(), "public", "uploads"),
      keepExtensions: true,
    });
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
      } else {
        resolve({ fields, files });
      }
    });
  });
}
