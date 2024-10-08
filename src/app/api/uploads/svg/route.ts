import { NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

export const POST = async (req: any) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const file = files[0]; // Use the first file in the list
    const filename = file.name.replace(/\s/g, "_");
    const uploadDir = path.join(process.cwd(), "public/assets");

    // Ensure the upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Convert the file to a buffer using arrayBuffer and Buffer.from
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write the file to the upload directory
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json(
      {
        name: filename.replace(".svg", ""),
        url: path.join("/assets", filename),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "File upload failed." },
      { status: 500 },
    );
  }
};
