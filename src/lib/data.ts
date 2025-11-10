import type { Client, Order, OrderWithClient, OrderStatus } from './types';
import { addDays, formatISO } from 'date-fns';

export const clients: Client[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dubois',
    phone: '06 12 34 56 78',
    email: 'marie.dubois@example.com',
    address: '123 Rue de la Couture, 75001 Paris',
  },
  {
    id: '2',
    firstName: 'Jean',
    lastName: 'Martin',
    phone: '07 87 65 43 21',
    email: 'jean.martin@example.com',
    address: '45 Avenue des Tissus, 69002 Lyon',
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Bernard',
    phone: '06 55 55 55 55',
    email: 'sophie.bernard@example.com',
    address: '67 Boulevard de la Mode, 13008 Marseille',
  },
  {
    id: '4',
    firstName: 'Lucas',
    lastName: 'Petit',
    phone: '06 11 22 33 44',
    email: 'lucas.petit@example.com',
    address: '89 Rue du Fil, 31000 Toulouse',
  },
];

const orders: Order[] = [
  {
    id: 'ord-001',
    clientId: '1',
    title: 'Robe de Soirée Élégance',
    description: 'Robe longue en satin de soie bleu nuit, avec un dos nu et des incrustations de dentelle.',
    images: ['https://picsum.photos/seed/10/600/400', 'https://picsum.photos/seed/11/600/400'],
    deliveryDate: formatISO(addDays(new Date(), 5)),
    totalPrice: 450,
    deposit: 200,
    status: 'En cours',
    measurements: {
      tourDePoitrine: "92",
      tourDeTaille: "71",
      tourDeHanches: "99",
      longueurBras: "60",
      longueurJambe: "105",
      carrureDos: "41",
    }
  },
  {
    id: 'ord-002',
    clientId: '2',
    title: 'Costume Trois Pièces Sur Mesure',
    description: 'Costume en laine grise, comprenant une veste, un pantalon et un gilet. Doublure intérieure en soie personnalisée.',
    images: ['https://picsum.photos/seed/12/600/400'],
    deliveryDate: formatISO(addDays(new Date(), 12)),
    totalPrice: 1200,
    deposit: 600,
    status: 'En cours',
    measurements: {},
  },
  {
    id: 'ord-003',
    clientId: '3',
    title: 'Jupe Plissée & Blouse',
    description: 'Ensemble coordonné : jupe plissée mi-longue en coton fleuri et blouse assortie à manches bouffantes.',
    images: ['https://picsum.photos/seed/13/600/400', 'https://picsum.photos/seed/14/600/400'],
    deliveryDate: formatISO(addDays(new Date(), -2)),
    totalPrice: 280,
    deposit: 100,
    status: 'Prêt à livrer',
    measurements: {
        tourDePoitrine: "88",
        tourDeTaille: "68",
        tourDeHanches: "95",
    }
  },
  {
    id: 'ord-004',
    clientId: '1',
    title: 'Manteau d\'Hiver en Laine',
    description: 'Manteau long et chaud en cachemire beige, avec une ceinture à nouer et de larges revers.',
    images: ['https://picsum.photos/seed/15/600/400'],
    deliveryDate: formatISO(addDays(new Date(), 30)),
    totalPrice: 850,
    deposit: 400,
    status: 'En attente',
    measurements: {},
  },
  {
    id: 'ord-005',
    clientId: '4',
    title: 'Chemise en Lin',
    description: 'Chemise décontractée en lin blanc, coupe droite.',
    images: [],
    deliveryDate: formatISO(addDays(new Date(), -10)),
    totalPrice: 120,
    deposit: 120,
    status: 'Terminée',
    measurements: {},
  },
];

export const getClients = async (): Promise<Client[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return clients;
};

export const getOrders = async (): Promise<OrderWithClient[]> => {
  // Simulate network delay and data joining
  await new Promise((resolve) => setTimeout(resolve, 500));
  return orders.map(order => {
    const client = clients.find(c => c.id === order.clientId);
    return {
      ...order,
      clientName: client ? `${client.firstName} ${client.lastName}` : 'Client Inconnu',
      clientEmail: client ? client.email : '',
    };
  }).sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());
};

export function formatCurrency(amount: number) {
    const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        currencyDisplay: 'code'
    });
    return formatter.format(amount).replace('XOF', 'FCFA');
}

export function getStatusVariant(status: OrderStatus) {
  switch (status) {
    case 'Terminée':
      return 'secondary';
    case 'En cours':
      return 'default';
    case 'Prêt à livrer':
      return 'destructive'; // Using destructive for high visibility
    case 'En attente':
      return 'outline';
    default:
      return 'secondary';
  }
}
