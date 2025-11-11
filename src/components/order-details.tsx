"use client"

import { OrderWithClient, formatCurrency } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getStatusVariant } from "@/lib/data";
import { Button } from "./ui/button";
import { Pencil, User, Phone } from "lucide-react";
import { Measurements } from "@/lib/types";

interface OrderDetailsProps {
    order: OrderWithClient;
    onEdit: () => void;
}

function MeasurementItem({ label, value, unit }: { label: string; value?: string | number, unit: string }) {
    if (!value) return null;
    const formattedLabel = label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace('tour De', 'T.')
      .replace('longueur', 'L.')
      .replace('carrure', 'C.');

    return (
        <div>
            <p className="text-sm text-muted-foreground">{formattedLabel}</p>
            <p className="font-medium">{value} {unit}</p>
        </div>
    );
}

function renderMeasurements(measurements: Measurements) {
    const { unit, standard, custom } = measurements;
    const hasStandard = Object.values(standard).some(v => v);
    const hasCustom = custom && custom.length > 0;

    if (!hasStandard && !hasCustom) {
        return <p className="text-sm text-muted-foreground text-center py-4">Aucune mensuration spécifiée.</p>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 rounded-lg border p-4">
            {hasStandard && Object.entries(standard)
                .filter(([, value]) => value)
                .map(([key, value]) => (
                    <MeasurementItem key={key} label={key} value={value} unit={unit} />
            ))}
            {hasCustom && custom.map((item, index) => (
                <MeasurementItem key={index} label={item.name} value={item.value} unit={unit} />
            ))}
        </div>
    )
}

export default function OrderDetails({ order, onEdit }: OrderDetailsProps) {
    const balance = order.totalPrice - order.deposit;

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <User className="h-4 w-4 text-muted-foreground" />
                           <p className="text-sm font-medium text-muted-foreground">Client</p>
                        </div>
                        <p className="pl-6">{order.clientName}</p>
                         {order.guestClientContact && (
                           <div className="flex items-center gap-2 pl-6">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">{order.guestClientContact}</p>
                           </div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Date de livraison</p>
                        <p>{format(parseISO(order.deliveryDate), "dd MMMM yyyy", { locale: fr })}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Statut</p>
                        <p><Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="whitespace-pre-wrap">{order.description || "N/A"}</p>
                    </div>
                </div>

                {order.images && order.images.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Images du modèle</p>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {order.images.map((img, index) => (
                                <div key={index} className="flex-shrink-0">
                                    <Image src={img} alt={`Image ${index + 1} for ${order.title}`} width={150} height={150} className="rounded-md object-cover aspect-square" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {order.measurements && (
                    <div>
                        <h3 className="text-base font-semibold mb-2 text-foreground">Mensurations</h3>
                        {renderMeasurements(order.measurements)}
                    </div>
                )}
            </div>
            
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
            
            <Separator />

            <div className="flex justify-end">
                <Button onClick={onEdit}><Pencil className="mr-2 h-4 w-4" /> Modifier la commande</Button>
            </div>
        </div>
    )
}
