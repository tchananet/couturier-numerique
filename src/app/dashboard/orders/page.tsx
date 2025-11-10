import { getOrders, getClients, getPatterns } from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderActions from "@/components/order-actions";
import OrdersTable from "@/components/orders-table";
import { Suspense } from "react";
import OrdersLoading from "./loading";

export default async function OrdersPage() {
  const orders = await getOrders();
  const clients = await getClients();
  const patterns = await getPatterns();

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
            <OrderActions clients={clients} patterns={patterns} />
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<OrdersLoading/>}>
            <OrdersTable orders={orders} clients={clients} patterns={patterns} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
