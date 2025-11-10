"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import OrderDetails from "@/components/order-details";
import OrderForm from "@/components/order-form";
import { Client, OrderWithClient } from "@/lib/types";

interface OrderActionsProps {
  order?: OrderWithClient;
  clients: Client[];
}

type DialogType = "details" | "edit" | null;

export default function OrderActions({ order, clients }: OrderActionsProps) {
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  
  const handleOpenDialog = (type: DialogType) => {
    setDialogType(type);
    setOpen(true);
  };

  if (!order) {
    // Case for "Ajouter une commande" button
    return (
       <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter une commande
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>Créer une nouvelle commande</DialogTitle>
            </DialogHeader>
            <OrderForm clients={clients} onFinished={() => setOpen(false)} />
        </DialogContent>
       </Dialog>
    )
  }

  const getDialogContent = () => {
    if (dialogType === "details") {
      return (
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{order.title}</DialogTitle>
            <DialogDescription>
              Détails de la commande pour {order.clientName}.
            </DialogDescription>
          </DialogHeader>
          <OrderDetails order={order} />
        </DialogContent>
      );
    }
    if (dialogType === "edit") {
      return (
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Modifier la commande</DialogTitle>
          </DialogHeader>
          <OrderForm order={order} clients={clients} onFinished={() => setOpen(false)} />
        </DialogContent>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => handleOpenDialog("details")}>
            Voir détails
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleOpenDialog("edit")}>
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem>Marquer comme 'Prêt'</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            Annuler
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {getDialogContent()}
    </Dialog>
  );
}
