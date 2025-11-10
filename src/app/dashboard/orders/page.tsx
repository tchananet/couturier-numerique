import { getOrders, formatCurrency, getStatusVariant } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-headline">Mes Commandes</h1>
        <p className="text-muted-foreground">
          Suivez et gérez toutes vos commandes.
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
                <Select>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Prêt à livrer">Prêt à livrer</SelectItem>
                        <SelectItem value="Terminée">Terminée</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une commande
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                    <TableRow key={order.id}>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir détails</DropdownMenuItem>
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                             <DropdownMenuItem>Marquer comme 'Prêt'</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Annuler</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
