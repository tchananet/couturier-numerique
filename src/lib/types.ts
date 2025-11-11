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

export type MeasurementUnit = "cm" | "in";

export type Measurements = {
  unit: MeasurementUnit;
  standard: {
    tourDePoitrine?: string;
    tourDeTaille?: string;
    tourDeHanches?: string;
    longueurBras?: string;
    longueurJambe?: string;
    carrureDos?: string;
  };
  custom: Array<{ name: string; value: string }>;
};

export type Pattern = {
  id: string;
  name: string;
  measurements: Measurements;
};

export type OrderStatus = "En attente" | "En cours" | "Prêt à livrer" | "Terminée";

export type Payment = {
  amount: number;
  date: Date;
};

export type Order = {
  id: string;
  clientId?: string; // Made optional
  guestClientName?: string;
  guestClientContact?: string;
  title: string;
  description: string;
  images: string[];
  progressImages?: string[];
  deliveryDate: string;
  totalPrice: number;
  payments: Payment[];
  status: OrderStatus;
  measurements: Measurements;
};

// Joined data types for easier display
export type OrderWithClient = Order & {
  clientName: string;
  clientEmail?: string;
};
