import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import middleware from "next-auth/middleware";

export default middleware;

export const config = {
  matcher: [
    "/dashboard",
    "/picks",
    "/place-pick",
    // "/profile",
    // "/settings",
    "/refer-and-earn",
    "/community",
  ],
};
