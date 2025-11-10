"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import OrderActions from "@/components/order-actions";
import { formatCurrency, getStatusVariant } from "@/lib/data";
import { Client, OrderWithClient, Pattern } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrderDetails from "./order-details";
import OrderForm from "./order-form";

interface OrdersTableProps {
  orders: OrderWithClient[];
  clients: Client[];
  patterns: Pattern[];
}

type DialogType = "details" | "edit";

export default function OrdersTable({ orders, clients, patterns }: OrdersTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithClient | null>(null);

  const handleRowClick = (order: OrderWithClient) => {
    setSelectedOrder(order);
    setDialogType("details");
    setDialogOpen(true);
  };

  const handleEditClick = (order?: OrderWithClient) => {
    const orderToEdit = order || selectedOrder;
    if (orderToEdit) {
      setSelectedOrder(orderToEdit);
      setDialogType("edit");
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
    setDialogType(null);
  };

  const getDialogContent = () => {
    if (!dialogOpen || !selectedOrder) return null;

    if (dialogType === "details") {
      return (
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedOrder.title}</DialogTitle>
            <DialogDescription>
              Détails de la commande pour {selectedOrder.clientName}.
            </DialogDescription>
          </DialogHeader>
          <OrderDetails order={selectedOrder} onEdit={() => handleEditClick()} />
        </DialogContent>
      );
    }

    if (dialogType === "edit") {
      return (
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la commande</DialogTitle>
          </DialogHeader>
          <OrderForm order={selectedOrder} clients={clients} patterns={patterns} onFinished={handleCloseDialog} />
        </DialogContent>
      );
    }

    return null;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className="hidden lg:table-cell">Titre</TableHead>
              <TableHead className="hidden sm:table-cell">Date de livraison</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="hidden md:table-cell text-right">Prix</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const balance = order.totalPrice - order.deposit;
              return (
                <TableRow key={order.id} onClick={() => handleRowClick(order)} className="cursor-pointer">
                  <TableCell>
                    <div className="font-medium">{order.clientName}</div>
                    <div className="text-sm text-muted-foreground lg:hidden">{order.title}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{order.title}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {format(parseISO(order.deliveryDate), 'dd MMMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right">
                    <div>{formatCurrency(order.totalPrice)}</div>
                    <div className={`text-sm ${balance <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                      Solde: {formatCurrency(balance)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <OrderActions order={order} clients={clients} patterns={patterns} onEdit={() => handleEditClick(order)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {getDialogContent()}
      </Dialog>
    </>
  );
}
