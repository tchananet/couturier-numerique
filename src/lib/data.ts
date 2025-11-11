import type { Client, Order, OrderWithClient, OrderStatus, Pattern } from './types';
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

export const patterns: Pattern[] = [
    {
      id: 'pat-1',
      name: 'Robe Standard - Taille 38',
      measurements: {
        unit: 'cm',
        standard: {
          tourDePoitrine: '88',
          tourDeTaille: '68',
          tourDeHanches: '95',
          longueurBras: '58',
        },
        custom: []
      },
    },
    {
      id: 'pat-2',
      name: 'Pantalon Homme - Taille 42',
      measurements: {
        unit: 'cm',
        standard: {
          tourDeTaille: '88',
          tourDeHanches: '100',
          longueurJambe: '108',
        },
        custom: [{ name: "Hauteur d'entrejambe", value: '32' }]
      },
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
        unit: 'cm',
        standard: {
            tourDePoitrine: "92",
            tourDeTaille: "71",
            tourDeHanches: "99",
            longueurBras: "60",
            carrureDos: "41",
        },
        custom: [],
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
    measurements: {
      unit: 'cm',
      standard: {},
      custom: [],
    },
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
        unit: 'cm',
        standard: {
            tourDePoitrine: "88",
            tourDeTaille: "68",
            tourDeHanches: "95",
        },
        custom: [],
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
    measurements: {
        unit: 'cm',
        standard: {},
        custom: [],
    },
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
    measurements: {
        unit: 'cm',
        standard: {},
        custom: [],
    },
  },
  {
    id: 'ord-006',
    guestClientName: 'Client Pressé',
    guestClientContact: '0600000000',
    title: 'Retouche pantalon',
    description: 'Ourlet sur un pantalon en jean.',
    images: [],
    deliveryDate: formatISO(addDays(new Date(), 1)),
    totalPrice: 20,
    deposit: 20,
    status: 'En attente',
    measurements: {
        unit: 'cm',
        standard: {},
        custom: [],
    },
  },
];

export const getClients = async (): Promise<Client[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return clients;
};

export const getPatterns = async (): Promise<Pattern[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return patterns;
};

export const getOrders = async (): Promise<OrderWithClient[]> => {
  // Simulate network delay and data joining
  await new Promise((resolve) => setTimeout(resolve, 500));
  return orders.map(order => {
    if (order.clientId) {
      const client = clients.find(c => c.id === order.clientId);
      return {
        ...order,
        clientName: client ? `${client.firstName} ${client.lastName}` : 'Client Inconnu',
        clientEmail: client ? client.email : '',
      };
    }
    return {
      ...order,
      clientName: order.guestClientName || 'Client Invité',
    }
  }).sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());
};

export function formatCurrency(amount: number) {
    const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF', // CFA Franc
    });
    // Replace XOF with FCFA which is more common
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
