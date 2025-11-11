"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale";
import { CalendarIcon, PlusCircle, Trash2, Upload, X } from "lucide-react"
import { Client, Order, OrderStatus, Pattern } from "@/lib/types"
import { useRef, useState } from "react"
import Image from "next/image"
import { Separator } from "./ui/separator"

const orderStatus: OrderStatus[] = ["En attente", "En cours", "Prêt à livrer", "Terminée"];

const paymentSchema = z.object({
    amount: z.coerce.number().min(0, "Le montant doit être positif."),
    date: z.date({ required_error: "La date est requise." }),
});

const formSchema = z.object({
  clientId: z.string().optional(),
  guestClientName: z.string().optional(),
  guestClientContact: z.string().optional(),
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères."),
  description: z.string().optional(),
  deliveryDate: z.date({ required_error: "La date de livraison est requise." }),
  totalPrice: z.coerce.number().min(0, "Le prix doit être positif."),
  payments: z.array(paymentSchema),
  status: z.enum(orderStatus),
  measurements: z.object({
    unit: z.enum(["cm", "in"]),
    standard: z.object({
        tourDePoitrine: z.string().optional(),
        tourDeTaille: z.string().optional(),
        tourDeHanches: z.string().optional(),
        longueurBras: z.string().optional(),
        longueurJambe: z.string().optional(),
        carrureDos: z.string().optional(),
    }),
    custom: z.array(z.object({
        name: z.string().min(1, "Le nom est requis"),
        value: z.string().min(1, "La valeur est requise"),
    })).optional(),
  }),
  images: z.array(z.string()).optional(),
  progressImages: z.array(z.string()).optional(),
}).refine(data => !!data.clientId || !!data.guestClientName, {
    message: "Vous devez soit sélectionner un client existant, soit saisir le nom d'un nouveau client.",
    path: ["guestClientName"],
});

type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  order?: Order;
  clients: Client[];
  patterns: Pattern[];
  onFinished?: () => void;
}

const ImageUploader = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImageUrls: string[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          newImageUrls.push(reader.result);
          if (newImageUrls.length === files.length) {
            onChange([...value, ...newImageUrls]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = value.filter((_, i) => i !== index);
    onChange(updatedPreviews);
  };

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        multiple
        accept="image/*"
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Télécharger des images
      </Button>
      {value.length > 0 && (
        <div className="flex gap-4 pt-2 overflow-x-auto">
          {value.map((src, index) => (
            <div key={index} className="relative flex-shrink-0">
              <Image
                src={src}
                alt={`Aperçu ${index + 1}`}
                width={100}
                height={100}
                className="rounded-md object-cover aspect-square"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default function OrderForm({ order, clients, patterns, onFinished }: OrderFormProps) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: order ? {
        ...order,
        deliveryDate: new Date(order.deliveryDate),
        payments: order.payments.map(p => ({...p, date: new Date(p.date)}))
    } : {
      title: "",
      description: "",
      totalPrice: 0,
      payments: [],
      status: "En attente",
      measurements: {
        unit: 'cm',
        standard: {},
        custom: [],
      },
      images: [],
      progressImages: [],
    },
  })

  const { fields: measurementFields, append: appendMeasurement, remove: removeMeasurement } = useFieldArray({
    control: form.control,
    name: "measurements.custom",
  });
  
  const { fields: paymentFields, append: appendPayment, remove: removePayment } = useFieldArray({
    control: form.control,
    name: "payments",
  });
  
  const unit = form.watch("measurements.unit");
  const selectedClientId = form.watch("clientId");

  function handlePatternSelect(patternId: string) {
    const selectedPattern = patterns.find(p => p.id === patternId);
    if (selectedPattern) {
        form.setValue("measurements", selectedPattern.measurements);
    }
  }

  function onSubmit(values: OrderFormValues) {
    console.log(values)
    // Here you would typically call an API to save the order
    if (onFinished) {
      onFinished();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="pr-1 space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Titre de la commande</FormLabel><FormControl><Input placeholder="Ex: Robe de mariée" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="clientId" render={({ field }) => (<FormItem><FormLabel>Client Existant (Optionnel)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez un client" /></SelectTrigger></FormControl><SelectContent>{clients.map(client => (<SelectItem key={client.id} value={client.id}>{client.firstName} {client.lastName}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />

            <div className="flex items-center gap-4"><Separator className="flex-1" /><span className="text-xs text-muted-foreground">OU</span><Separator className="flex-1" /></div>

            <div className="space-y-4">
                 <FormField control={form.control} name="guestClientName" render={({ field }) => (<FormItem><FormLabel>Nom du nouveau client</FormLabel><FormControl><Input placeholder="Ex: Aïssatou Ndiaye" {...field} disabled={!!selectedClientId} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="guestClientContact" render={({ field }) => (<FormItem><FormLabel>Contact du nouveau client</FormLabel><FormControl><Input placeholder="Téléphone ou email" {...field} disabled={!!selectedClientId} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Détails de la commande..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <ImageUploader label="Images du modèle" value={field.value || []} onChange={field.onChange} />
                    )}
                />
                 {order && (
                    <FormField
                        control={form.control}
                        name="progressImages"
                        render={({ field }) => (
                            <ImageUploader label="Photos de l'avancement" value={field.value || []} onChange={field.onChange} />
                        )}
                    />
                )}
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Mensurations</h3>
                     <Select onValueChange={handlePatternSelect}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Appliquer un patron" />
                        </SelectTrigger>
                        <SelectContent>{patterns.map(pattern => (<SelectItem key={pattern.id} value={pattern.id}>{pattern.name}</SelectItem>))}</SelectContent>
                    </Select>
                </div>
                <FormField control={form.control} name="measurements.unit" render={({ field }) => (<FormItem className="mb-4"><FormLabel>Unité</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="cm">cm</SelectItem><SelectItem value="in">in</SelectItem></SelectContent></Select></FormItem>)} />
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Standards</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    <FormField control={form.control} name="measurements.standard.tourDePoitrine" render={({ field }) => (<FormItem><FormLabel>Poitrine</FormLabel><FormControl><Input type="text" placeholder="92" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="measurements.standard.tourDeTaille" render={({ field }) => (<FormItem><FormLabel>Taille</FormLabel><FormControl><Input type="text" placeholder="71" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="measurements.standard.tourDeHanches" render={({ field }) => (<FormItem><FormLabel>Hanches</FormLabel><FormControl><Input type="text" placeholder="99" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="measurements.standard.longueurBras" render={({ field }) => (<FormItem><FormLabel>Lg. bras</FormLabel><FormControl><Input type="text" placeholder="60" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="measurements.standard.longueurJambe" render={({ field }) => (<FormItem><FormLabel>Lg. jambe</FormLabel><FormControl><Input type="text" placeholder="105" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="measurements.standard.carrureDos" render={({ field }) => (<FormItem><FormLabel>Carrure dos</FormLabel><FormControl><Input type="text" placeholder="41" {...field} /></FormControl></FormItem>)} />
                </div>
                 <h4 className="text-sm font-medium mb-2 text-muted-foreground">Personnalisées</h4>
                <div className="space-y-4">
                  {measurementFields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2">
                      <FormField control={form.control} name={`measurements.custom.${index}.name`} render={({ field }) => (<FormItem className="flex-1"><FormLabel>Nom</FormLabel><FormControl><Input {...field} placeholder="Ex: Hauteur buste" /></FormControl></FormItem>)} />
                      <FormField control={form.control} name={`measurements.custom.${index}.value`} render={({ field }) => (<FormItem className="w-28"><FormLabel>Valeur ({unit})</FormLabel><FormControl><Input {...field} placeholder="27" /></FormControl></FormItem>)} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeMeasurement(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendMeasurement({ name: "", value: "" })}><PlusCircle className="mr-2 h-4 w-4" />Ajouter une mesure</Button>
                </div>
            </div>

            <div className="space-y-4">
                <FormField control={form.control} name="totalPrice" render={({ field }) => (<FormItem><FormLabel>Prix Total</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>)} />
                
                <div>
                     <h3 className="text-lg font-medium mb-2">Paiements</h3>
                     <div className="space-y-4">
                        {paymentFields.map((field, index) => (
                            <div key={field.id} className="flex items-end gap-2 p-3 border rounded-lg">
                                <FormField control={form.control} name={`payments.${index}.amount`} render={({ field }) => (<FormItem className="flex-1"><FormLabel>Montant</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name={`payments.${index}.date`} render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><_components.Format value={field.value} /><CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removePayment(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendPayment({ amount: 0, date: new Date() })}><PlusCircle className="mr-2 h-4 w-4" />Ajouter un paiement</Button>
                     </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="deliveryDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date de livraison</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><_components.Format value={field.value} /><CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Statut</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Statut de la commande" /></SelectTrigger></FormControl><SelectContent>{orderStatus.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
        </div>
        <div className="pt-6 border-t flex justify-end sticky bottom-0 bg-background/95 py-3">
            <Button type="submit">{order ? "Enregistrer les modifications" : "Créer la commande"}</Button>
        </div>
      </form>
    </Form>
  )
}

    
const _components = {
  Format: ({ value }) => value ? format(value, "PPP", { locale: fr }) : <span>Choisissez une date</span>
};
