"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { CalendarIcon, Upload, X } from "lucide-react"
import { Client, Order, OrderStatus, Pattern } from "@/lib/types"
import { useRef, useState } from "react"
import Image from "next/image"
import { Separator } from "./ui/separator"

const orderStatus: OrderStatus[] = ["En attente", "En cours", "Prêt à livrer", "Terminée"];

const formSchema = z.object({
  clientId: z.string().optional(),
  guestClientName: z.string().optional(),
  guestClientContact: z.string().optional(),
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères."),
  description: z.string().optional(),
  deliveryDate: z.date({ required_error: "La date de livraison est requise." }),
  totalPrice: z.coerce.number().min(0, "Le prix doit être positif."),
  deposit: z.coerce.number().min(0, "L'acompte doit être positif."),
  status: z.enum(orderStatus),
  "measurements.tourDePoitrine": z.string().optional(),
  "measurements.tourDeTaille": z.string().optional(),
  "measurements.tourDeHanches": z.string().optional(),
  "measurements.longueurBras": z.string().optional(),
  "measurements.longueurJambe": z.string().optional(),
  "measurements.carrureDos": z.string().optional(),
  images: z.array(z.string()).optional(),
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

export default function OrderForm({ order, clients, patterns, onFinished }: OrderFormProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>(order?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: order ? {
        ...order,
        deliveryDate: new Date(order.deliveryDate),
        "measurements.tourDePoitrine": order.measurements?.tourDePoitrine || "",
        "measurements.tourDeTaille": order.measurements?.tourDeTaille || "",
        "measurements.tourDeHanches": order.measurements?.tourDeHanches || "",
        "measurements.longueurBras": order.measurements?.longueurBras || "",
        "measurements.longueurJambe": order.measurements?.longueurJambe || "",
        "measurements.carrureDos": order.measurements?.carrureDos || "",
        images: order.images || [],
    } : {
      title: "",
      description: "",
      totalPrice: 0,
      deposit: 0,
      status: "En attente",
      "measurements.tourDePoitrine": "",
      "measurements.tourDeTaille": "",
      "measurements.tourDeHanches": "",
      "measurements.longueurBras": "",
      "measurements.longueurJambe": "",
      "measurements.carrureDos": "",
      images: [],
    },
  })

  const selectedClientId = form.watch("clientId");

  function handlePatternSelect(patternId: string) {
    const selectedPattern = patterns.find(p => p.id === patternId);
    if (selectedPattern) {
        form.setValue("measurements.tourDePoitrine", selectedPattern.measurements.tourDePoitrine || "");
        form.setValue("measurements.tourDeTaille", selectedPattern.measurements.tourDeTaille || "");
        form.setValue("measurements.tourDeHanches", selectedPattern.measurements.tourDeHanches || "");
        form.setValue("measurements.longueurBras", selectedPattern.measurements.longueurBras || "");
        form.setValue("measurements.longueurJambe", selectedPattern.measurements.longueurJambe || "");
        form.setValue("measurements.carrureDos", selectedPattern.measurements.carrureDos || "");
    }
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    const newImageUrls: string[] = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          newImageUrls.push(reader.result);
          if (newImageUrls.length === files.length) {
            const updatedPreviews = [...imagePreviews, ...newImageUrls];
            setImagePreviews(updatedPreviews);
            form.setValue('images', updatedPreviews);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function handleRemoveImage(index: number) {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    form.setValue('images', updatedPreviews);
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
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Titre de la commande</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: Robe de mariée" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Client Existant (Optionnel)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un client" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                            {client.firstName} {client.lastName}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">OU</span>
                <Separator className="flex-1" />
            </div>

            <div className="space-y-4">
                 <FormField
                    control={form.control}
                    name="guestClientName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nom du nouveau client</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: Aïssatou Ndiaye" {...field} disabled={!!selectedClientId} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="guestClientContact"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Contact du nouveau client</FormLabel>
                        <FormControl>
                            <Input placeholder="Téléphone ou email" {...field} disabled={!!selectedClientId} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea placeholder="Détails de la commande..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <div className="space-y-2">
                <FormLabel>Images du modèle</FormLabel>
                 <Input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload}
                    multiple 
                    accept="image/*"
                    className="hidden"
                />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Télécharger des images
                </Button>
                {imagePreviews.length > 0 && (
                    <div className="flex gap-4 pt-2 overflow-x-auto">
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="relative flex-shrink-0">
                                <Image src={src} alt={`Aperçu ${index + 1}`} width={100} height={100} className="rounded-md object-cover aspect-square" />
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

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Mensurations</h3>
                     <Select onValueChange={handlePatternSelect}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Appliquer un patron" />
                        </SelectTrigger>
                        <SelectContent>
                        {patterns.map(pattern => (
                            <SelectItem key={pattern.id} value={pattern.id}>
                            {pattern.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="measurements.tourDePoitrine"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Poitrine (cm)</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="92" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="measurements.tourDeTaille"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Taille (cm)</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="71" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="measurements.tourDeHanches"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Hanches (cm)</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="99" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="measurements.longueurBras"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Lg. bras (cm)</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="60" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="measurements.longueurJambe"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Lg. jambe (cm)</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="105" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="measurements.carrureDos"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Carrure dos (cm)</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="41" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Prix Total</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="deposit"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Acompte versé</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Date de livraison</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                            ) : (
                                <span>Choisissez une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Statut de la commande" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {orderStatus.map(status => (
                            <SelectItem key={status} value={status}>
                            {status}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </div>
        <div className="pt-6 border-t flex justify-end sticky bottom-0 bg-background/95 py-3">
            <Button type="submit">{order ? "Enregistrer les modifications" : "Créer la commande"}</Button>
        </div>
      </form>
    </Form>
  )
}

    
