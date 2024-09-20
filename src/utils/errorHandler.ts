import { NextResponse } from "next/server";

export const handleError = (err: Error, status: number = 500) => {
  console.error(err); // log the  error
  return NextResponse.json({ message: err.message }, { status: 500 });
};
