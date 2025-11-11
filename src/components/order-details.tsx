"use client"

import * as React from "react";
import { OrderWithClient, formatCurrency } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getStatusVariant } from "@/lib/data";
import { Button } from "./ui/button";
import { Calendar, CreditCard, DollarSign, Pencil, User, Phone, Hash, Image as ImageIcon, CheckCircle } from "lucide-react";
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

function ImageGallery({ title, images }: { title: string; images: string[] }) {
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                {title === "Photos de l'avancement" ? <CheckCircle className="h-5 w-5 text-green-500" /> : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
                {title}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 -ml-6 -mr-6 px-6">
                {images.map((img, index) => (
                    <div key={index} className="flex-shrink-0">
                        <a href={img} target="_blank" rel="noopener noreferrer">
                            <Image src={img} alt={`${title} ${index + 1}`} width={150} height={150} className="rounded-md object-cover aspect-square" />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function OrderDetails({ order, onEdit }: OrderDetailsProps) {
    const totalPaid = order.payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = order.totalPrice - totalPaid;

    return (
        <div className="space-y-6">
            <div className="space-y-6">
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
                        <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-muted-foreground" />
                           <p className="text-sm font-medium text-muted-foreground">Date de livraison</p>
                        </div>
                        <p className="pl-6">{format(parseISO(order.deliveryDate), "dd MMMM yyyy", { locale: fr })}</p>
                    </div>
                    <div className="space-y-1">
                         <p className="text-sm font-medium text-muted-foreground pl-6">Statut</p>
                        <p className="pl-6"><Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="whitespace-pre-wrap">{order.description || "N/A"}</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <ImageGallery title="Images du modèle" images={order.images} />
                    <ImageGallery title="Photos de l'avancement" images={order.progressImages || []} />
                </div>

                {order.measurements && (
                    <div>
                        <h3 className="text-base font-semibold mb-2 text-foreground">Mensurations</h3>
                        {renderMeasurements(order.measurements)}
                    </div>
                )}
            </div>
            
            <Separator />
            
            <div>
                 <h3 className="text-base font-semibold mb-2 text-foreground">Détails financiers</h3>
                <div className="grid grid-cols-3 gap-4">
                    <p className="text-sm font-medium text-muted-foreground col-span-2">Prix total</p>
                    <p className="font-semibold text-right">{formatCurrency(order.totalPrice)}</p>

                    <p className="text-sm font-medium text-muted-foreground col-span-3 pt-2 border-b pb-2">Paiements reçus</p>
                    {order.payments.length > 0 ? order.payments.map((payment, index) => (
                        <React.Fragment key={index}>
                            <div className="text-sm text-muted-foreground col-span-2 flex items-center gap-2">
                                <CreditCard className="h-4 w-4"/>
                                <span>Paiement du {format(new Date(payment.date), "dd/MM/yyyy")}</span>
                            </div>
                            <p className="text-sm text-right">{formatCurrency(payment.amount)}</p>
                        </React.Fragment>
                    )) : (
                        <p className="text-sm text-muted-foreground col-span-3 text-center">Aucun paiement enregistré</p>
                    )}
                    
                    <div className="col-span-3 border-t my-2" />

                     <p className="font-medium col-span-2">Total versé</p>
                     <p className="font-medium text-right">{formatCurrency(totalPaid)}</p>
                    
                     <p className="font-medium col-span-2">Solde restant</p>
                    <p className={`font-semibold text-right ${balance <= 0 ? 'text-green-600' : 'text-amber-600'}`}>{formatCurrency(balance)}</p>
                </div>
            </div>
            
            <Separator />

            <div className="flex justify-end">
                <Button onClick={onEdit}><Pencil className="mr-2 h-4 w-4" /> Modifier la commande</Button>
            </div>
        </div>
    )
}
