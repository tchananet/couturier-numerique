export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
};

export type MeasurementSet = {
  id: string;
  clientId: string;
  date: string;
  measurements: { [key: string]: number };
};

export type OrderStatus = "En attente" | "En cours" | "Prêt à livrer" | "Terminée";

export type Order = {
  id: string;
  clientId: string;
  title: string;
  description: string;
  images: string[];
  deliveryDate: string;
  totalPrice: number;
  deposit: number;
  status: OrderStatus;
};

// Joined data types for easier display
export type OrderWithClient = Order & {
  clientName: string;
  clientEmail: string;
};
