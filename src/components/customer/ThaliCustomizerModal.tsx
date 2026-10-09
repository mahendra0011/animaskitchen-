import React from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { DishDetailModal } from "./DishDetailModal";

export const ThaliCustomizerModal: React.FC = () => {
  const { thaliModalItem, setThaliModalItem, thaliAddons, addToCart } = useDemoStore();

  return (
    <DishDetailModal
      item={thaliModalItem}
      open={!!thaliModalItem}
      onClose={() => setThaliModalItem(null)}
      thaliAddons={thaliAddons}
      onAddToCart={addToCart}
    />
  );
};
