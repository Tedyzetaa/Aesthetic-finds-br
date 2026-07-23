export type Product = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  precoExibicao: string; // texto livre, ex: "R$ 89,90" — vitrine não processa pagamento
  imagem: string; // URL da imagem principal
  imagens?: string[]; // galeria opcional
  linkRedirecionamento: string; // URL de saída (loja/afiliado)
  destaque: boolean;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export type ProductInput = Omit<Product, "id" | "criadoEm" | "atualizadoEm">;
