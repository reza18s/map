import { NextResponse } from "next/server";

export const handleError = (
  res: NextResponse,
  err: Error,
  status: number = 500,
) => {
  console.error(err); // log error
  return res.json({ message: err.message }, { status });
};
