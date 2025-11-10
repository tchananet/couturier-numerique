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
import { CalendarIcon } from "lucide-react"
import { Client, Order, OrderStatus } from "@/lib/types"

const orderStatus: OrderStatus[] = ["En attente", "En cours", "Prêt à livrer", "Terminée"];

const formSchema = z.object({
  clientId: z.string({ required_error: "Le client est requis." }),
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères."),
  description: z.string().optional(),
  deliveryDate: z.date({ required_error: "La date de livraison est requise." }),
  totalPrice: z.coerce.number().min(0, "Le prix doit être positif."),
  deposit: z.coerce.number().min(0, "L'acompte doit être positif."),
  status: z.enum(orderStatus),
});

type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  order?: Order;
  clients: Client[];
}

export default function OrderForm({ order, clients }: OrderFormProps) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: order ? {
        ...order,
        deliveryDate: new Date(order.deliveryDate),
    } : {
      title: "",
      description: "",
      totalPrice: 0,
      deposit: 0,
      status: "En attente"
    },
  })

  function onSubmit(values: OrderFormValues) {
    console.log(values)
    // Here you would typically call an API to save the order
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormLabel>Client</FormLabel>
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
                            format(field.value, "PPP")
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
        <Button type="submit">{order ? "Enregistrer les modifications" : "Créer la commande"}</Button>
      </form>
    </Form>
  )
}