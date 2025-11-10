"use client"

import { OrderWithClient, formatCurrency } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrderDetailsProps {
    order: OrderWithClient;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
    const balance = order.totalPrice - order.deposit;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Client</p>
                    <p>{order.clientName}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Date de livraison</p>
                    <p>{format(parseISO(order.deliveryDate), "dd MMMM yyyy", { locale: fr })}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Statut</p>
                    <p><Badge>{order.status}</Badge></p>
                </div>
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{order.description}</p>
                </div>
            </div>

            {order.images && order.images.length > 0 && (
                 <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Images</p>
                    <div className="flex gap-4 overflow-x-auto">
                        {order.images.map((img, index) => (
                            <Image key={index} src={img} alt={`Image ${index + 1} for ${order.title}`} width={150} height={150} className="rounded-md object-cover" />
                        ))}
                    </div>
                </div>
            )}

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-right">
                <div />
                <p className="font-medium">Total:</p>
                <p className="font-semibold">{formatCurrency(order.totalPrice)}</p>

                <div />
                <p className="font-medium">Acompte:</p>
                <p>{formatCurrency(order.deposit)}</p>

                <div />
                 <p className="font-medium">Solde restant:</p>
                <p className={`font-semibold ${balance <= 0 ? 'text-green-600' : 'text-amber-600'}`}>{formatCurrency(balance)}</p>
            </div>

        </div>
    )
}