"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import ClientForm from "@/components/client-form";
import ClientDetails from "@/components/client-details";
import type { Client } from "@/lib/types";

interface ClientActionsProps {
  client?: Client;
}

type DialogType = "details" | "edit" | "add" | null;

export default function ClientActions({ client }: ClientActionsProps) {
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  
  const handleOpenDialog = (type: DialogType) => {
    setDialogType(type);
    setOpen(true);
  };

  const handleCloseDialog = () => {
      setOpen(false);
      setDialogType(null);
  }

  const getDialogContent = () => {
    switch(dialogType) {
        case "add":
            return (
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Ajouter un nouveau client</DialogTitle>
                    </DialogHeader>
                    <ClientForm onFinished={handleCloseDialog} />
                </DialogContent>
            );
        case "edit":
            return (
                 <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Modifier le client</DialogTitle>
                    </DialogHeader>
                    <ClientForm client={client} onFinished={handleCloseDialog} />
                </DialogContent>
            );
        case "details":
             if (!client) return null;
             return (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{client.firstName} {client.lastName}</DialogTitle>
                        <DialogDescription>{client.email}</DialogDescription>
                    </DialogHeader>
                    <ClientDetails client={client} />
                </DialogContent>
             );
        default:
            return null;
    }
  };

  if (!client) {
    // Case for "Ajouter un client" button
    return (
       <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog("add")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un client
            </Button>
        </DialogTrigger>
        {getDialogContent()}
       </Dialog>
    )
  }

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
          <DropdownMenuItem className="text-destructive">
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {getDialogContent()}
    </Dialog>
  );
}
