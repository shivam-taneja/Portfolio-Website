import { readFile } from "node:fs/promises";
import { join } from "node:path";

const sansFont = join(process.cwd(), "src/assets/fonts/SpaceGrotesk-Bold.woff");
const monoFont = join(
  process.cwd(),
  "src/assets/fonts/IBMPlexMono-Regular.woff",
);
const headshot = join(process.cwd(), "public/headshot.png");

function toArrayBuffer(data: Buffer) {
  return data.buffer.slice(
    data.byteOffset,
    data.byteOffset + data.byteLength,
  ) as ArrayBuffer;
}

export async function loadOgFonts() {
  const [sans, mono] = await Promise.all([
    readFile(sansFont),
    readFile(monoFont),
  ]);

  return [
    {
      name: "Sans",
      data: toArrayBuffer(sans),
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Mono",
      data: toArrayBuffer(mono),
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}

export async function loadHeadshot() {
  const file = await readFile(headshot);
  return `data:image/png;base64,${file.toString("base64")}`;
}
