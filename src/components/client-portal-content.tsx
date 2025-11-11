'use client';

import { OrderWithClient, getStatusVariant } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, CheckCircle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Progress } from "./ui/progress";

interface ImageGalleryProps {
  title: string;
  images: string[];
  icon: React.ReactNode;
}

function ImageGallery({ title, images, icon }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return (
        <div className="text-center py-10 border rounded-lg bg-muted/20">
            <div className="text-muted-foreground">{icon}</div>
            <p className="mt-2 text-sm text-muted-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">Aucune photo pour le moment.</p>
        </div>
    );
  }

  return (
    <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            {icon}
            {title}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
                <div key={index} className="flex-shrink-0">
                    <a href={img} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border hover:opacity-80 transition-opacity">
                        <Image src={img} alt={`${title} ${index + 1}`} width={200} height={200} className="object-cover aspect-square" />
                    </a>
                </div>
            ))}
        </div>
    </div>
  );
}

function getProgressValue(status: OrderWithClient['status']): number {
    switch (status) {
        case "En attente": return 10;
        case "En cours": return 50;
        case "Prêt à livrer": return 90;
        case "Terminée": return 100;
        default: return 0;
    }
}

export default function ClientPortalContent({ order }: { order: OrderWithClient }) {
  const progressValue = getProgressValue(order.status);
  
  return (
    <Card className="shadow-lg">
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <CardTitle className="font-headline text-3xl">{order.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        Livraison prévue le {format(parseISO(order.deliveryDate), "dd MMMM yyyy", { locale: fr })}
                    </CardDescription>
                </div>
                <Badge variant={getStatusVariant(order.status)} className="text-base px-4 py-1 self-start sm:self-center">{order.status}</Badge>
            </div>
            <div className="pt-4 space-y-2">
                <Progress value={progressValue} aria-label={`Avancement de la commande : ${progressValue}%`} />
                <p className="text-xs text-muted-foreground text-center">{`Avancement : ${progressValue}%`}</p>
            </div>
        </CardHeader>
        <CardContent className="space-y-8">
            <Separator />
            <ImageGallery 
                title="Modèles de référence" 
                images={order.images}
                icon={<ImageIcon className="h-8 w-8 mx-auto" />}
            />
             <Separator />
            <ImageGallery 
                title="Photos de l'avancement" 
                images={order.progressImages || []}
                icon={<CheckCircle className="h-8 w-8 mx-auto" />}
            />
        </CardContent>
    </Card>
  );
}