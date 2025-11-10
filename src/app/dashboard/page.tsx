import { getOrders, formatCurrency } from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CalendarCheck, Shirt } from "lucide-react";
import { format, parseISO, isWithinInterval, addDays, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

export default async function DashboardPage() {
  const orders = await getOrders();
  const now = new Date();

  const upcomingOrders = orders.filter(order => {
    const deliveryDate = parseISO(order.deliveryDate);
    return isWithinInterval(deliveryDate, { start: now, end: addDays(now, 7) }) && order.status !== 'Terminée';
  }).sort((a,b) => parseISO(a.deliveryDate).getTime() - parseISO(b.deliveryDate).getTime());

  const inProgressOrders = orders.filter(order => order.status === "En cours");
  const lateOrders = orders.filter(order => parseISO(order.deliveryDate) < now && order.status !== 'Terminée');

  const totalRevenueCompleted = orders
    .filter(o => o.status === 'Terminée')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Un aperçu de votre activité.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes en cours</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressOrders.length}</div>
            <p className="text-xs text-muted-foreground">Actuellement en confection</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus (Terminées)</CardTitle>
            <span className="text-muted-foreground">€</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenueCompleted)}</div>
            <p className="text-xs text-muted-foreground">Total des commandes finalisées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Échéances (7 prochains jours)</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingOrders.length}</div>
             <p className="text-xs text-muted-foreground">Commandes à livrer bientôt</p>
          </CardContent>
        </Card>
         <Card className="border-destructive/50 text-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes en retard</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lateOrders.length}</div>
             <p className="text-xs text-destructive/80">Livraisons dépassées</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Échéances Proches</CardTitle>
            <CardDescription>Commandes à livrer dans les 7 prochains jours.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingOrders.length > 0 ? (
              <ul className="space-y-4">
                {upcomingOrders.map(order => {
                   const daysLeft = differenceInDays(parseISO(order.deliveryDate), now);
                   const dayText = daysLeft === 0 ? "Aujourd'hui" : `Dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`;
                  return (
                  <li key={order.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary p-2 rounded-lg">
                        <Shirt className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{order.title}</p>
                        <p className="text-sm text-muted-foreground">{order.clientName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <Badge variant={daysLeft <= 2 ? 'destructive' : 'secondary'}>{dayText}</Badge>
                       <p className="text-sm text-muted-foreground mt-1">{format(parseISO(order.deliveryDate), 'dd MMM yyyy', { locale: fr })}</p>
                    </div>
                  </li>
                )})}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune échéance dans les 7 prochains jours.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">En Cours de Confection</CardTitle>
            <CardDescription>Suivi des commandes en production.</CardDescription>
          </CardHeader>
          <CardContent>
             {inProgressOrders.length > 0 ? (
              <ul className="space-y-4">
                {inProgressOrders.map(order => (
                  <li key={order.id} className="flex items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                      <div className="bg-secondary p-2 rounded-lg">
                        <Activity className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{order.title}</p>
                        <p className="text-sm text-muted-foreground">{order.clientName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-mono text-sm font-semibold">{formatCurrency(order.totalPrice)}</p>
                       <p className="text-sm text-muted-foreground">Livraison le {format(parseISO(order.deliveryDate), 'dd/MM/yy', { locale: fr })}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune commande en cours.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
