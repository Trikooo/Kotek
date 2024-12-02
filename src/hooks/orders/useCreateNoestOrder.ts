import { NoestOrderForm } from "@/types/types";
import { useState } from "react";

export default function useCreateNoestOrder() {
  const [noestOrder, setNoestOrder] = useState<NoestOrderForm>({
    api_token: "",
    user_guid: "",
    reference: null,
    client: "",
    phone: "",
    adresse: "",
    wilaya_id: 0,
    commune: "",
    montant: 0,
    remarque: "",
    produit: "",
    type_id: 1,
    poids: 0,
    stop_desk: 0,
    stock: 0,
    can_open: 0,
  });

  return {
    noestOrder,
    setNoestOrder,
  };
}
