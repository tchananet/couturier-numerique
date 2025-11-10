"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import OrderForm from "@/components/order-form";
import { Client, OrderWithClient, Pattern } from "@/lib/types";

interface OrderActionsProps {
  order?: OrderWithClient;
  clients: Client[];
  patterns: Pattern[];
  onEdit?: () => void;
}

export default function OrderActions({ order, clients, patterns, onEdit }: OrderActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (!order) {
    // Case for "Ajouter une commande" button
    return (
       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter une commande
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Créer une nouvelle commande</DialogTitle>
            </DialogHeader>
            <OrderForm clients={clients} patterns={patterns} onFinished={() => setDialogOpen(false)} />
        </DialogContent>
       </Dialog>
    )
  }

  // Row actions dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); onEdit?.(); }}>
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem>Marquer comme 'Prêt'</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">
          Annuler
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
