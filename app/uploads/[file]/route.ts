import { readFile } from "fs/promises";
import path from "path";

const TIPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  const nama = path.basename(file);
  const tipe = TIPE[path.extname(nama).toLowerCase()];

  if (!tipe || nama !== file) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const data = await readFile(path.join(process.cwd(), "uploads", nama));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": tipe,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}