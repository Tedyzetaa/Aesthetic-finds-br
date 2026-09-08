import { NextRequest, NextResponse } from "next/server";
import { getProduct, updateProduct, deleteProduct } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const produto = await getProduct(params.id);
    if (!produto) {
      return NextResponse.json({ erro: "Produto não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ item: produto });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ erro: "Não foi possível buscar o produto." }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const produto = await updateProduct(params.id, body);
    if (!produto) {
      return NextResponse.json({ erro: "Produto não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ item: produto });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ erro: "Não foi possível atualizar o produto." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ok = await deleteProduct(params.id);
    if (!ok) {
      return NextResponse.json({ erro: "Produto não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ erro: "Não foi possível excluir o produto." }, { status: 500 });
  }
}
