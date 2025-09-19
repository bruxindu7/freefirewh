import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BUCKPAY_BASE_URL = "https://api.realtechdev.com.br";

// 🔐 lista de domínios permitidos
const allowedOrigins = [
  "https://www.recargajogo.mom",
  "http://localhost:3000",
];

// helper para validar a origem
function isOriginAllowed(request: NextRequest): boolean {
  const referer = request.headers.get("referer");
  if (!referer) return false;
  return allowedOrigins.some((origin) => referer.startsWith(origin));
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ external_id: string }> }
) {
  if (!isOriginAllowed(request)) {
    return NextResponse.json(
      { error: "Origem não permitida" },
      { status: 403 }
    );
  }

  try {
    const { external_id } = await context.params;

    const r = await fetch(
      `${BUCKPAY_BASE_URL}/v1/transactions/external_id/${external_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BUCKPAY_TOKEN!}`,
          "User-Agent": "Buckpay API",
        },
      }
    );

    const data = await r.json();
    console.log("➡ Status BuckPay:", r.status, data);

    if (!r.ok) {
      return NextResponse.json({ error: data }, { status: r.status });
    }

    return NextResponse.json(
      {
        id: data.data.id,
        status: data.data.status,
        amount: data.data.total_amount,
        createdAt: data.data.created_at,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erro backend status PIX:", err);
    return NextResponse.json(
      { error: "Falha ao consultar status PIX" },
      { status: 500 }
    );
  }
}
