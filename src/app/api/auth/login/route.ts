import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { BACKEND_URL } from "@/utils/server_provider";

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${BACKEND_URL}/api/v1/auth/web/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      }
    );

    if (response.status !== 200) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const data = response.data;

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
        },
        access_token: data.access_token,
        expires_in: data.expires_in,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.detail || "Login failed";

      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
