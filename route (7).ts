import { NextRequest, NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/db";
import { ProductInput } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const categoria = searchParams.get("categoria") || undefined;
  const admin = searchParams.get("admin") === "1";

  try {
    const items = await listProducts({
      q,
      categoria,
      somenteAtivos: !admin
    });
    return NextResponse.json({ items });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { erro: "Não foi possível carregar os produtos." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ProductInput;

  if (!body.titulo || !body.linkRedirecionamento || !body.imagem) {
    return NextResponse.json(
      { erro: "Título, imagem e link de redirecionamento são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const produto = await createProduct({
      titulo: body.titulo,
      descricao: body.descricao || "",
      categoria: body.categoria || "Geral",
      precoExibicao: body.precoExibicao || "",
      imagem: body.imagem,
      imagens: body.imagens || [],
      linkRedirecionamento: body.linkRedirecionamento,
      destaque: !!body.destaque,
      ativo: body.ativo !== false
    });
    return NextResponse.json({ item: produto }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { erro: "Não foi possível salvar o produto." },
      { status: 500 }
    );
  }
}
