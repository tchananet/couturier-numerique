"use client"

import type { Client } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Home } from "lucide-react";

interface ClientDetailsProps {
    client: Client;
}

export default function ClientDetails({ client }: ClientDetailsProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={`https://picsum.photos/seed/${client.id}/100/100`} />
                    <AvatarFallback>
                        {client.firstName.charAt(0)}
                        {client.lastName.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold">{client.firstName} {client.lastName}</h2>
                    <p className="text-muted-foreground">Client depuis le {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
            </div>
            <Card>
                <CardContent className="pt-6 space-y-4">
                     <div className="flex items-start gap-4">
                        <Mail className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <a href={`mailto:${client.email}`} className="font-medium text-primary hover:underline">{client.email}</a>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                            <p className="text-sm text-muted-foreground">Téléphone</p>
                            <p className="font-medium">{client.phone}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Home className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                            <p className="text-sm text-muted-foreground">Adresse</p>
                            <p className="font-medium">{client.address}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
