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
import type { Pattern } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { PlusCircle, Trash2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
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
  })
})

type PatternFormValues = z.infer<typeof formSchema>

interface PatternFormProps {
  pattern?: Pattern;
  onFinished?: () => void;
}

export default function PatternForm({ pattern, onFinished }: PatternFormProps) {
  const form = useForm<PatternFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: pattern || {
      name: "",
      measurements: {
        unit: "cm",
        standard: {
          tourDePoitrine: "",
          tourDeTaille: "",
          tourDeHanches: "",
          longueurBras: "",
          longueurJambe: "",
          carrureDos: "",
        },
        custom: [],
      }
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "measurements.custom",
  });
  
  const unit = form.watch("measurements.unit");

  function onSubmit(values: PatternFormValues) {
    console.log(values)
    // Here you would typically call an API to save the pattern
    if (onFinished) {
      onFinished();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du patron</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Robe Standard - T38" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
            <h3 className="text-base font-medium mb-2 text-foreground">Mensurations</h3>
            <FormField
                control={form.control}
                name="measurements.unit"
                render={({ field }) => (
                    <FormItem className="mb-4">
                    <FormLabel>Unité</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="in">in</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
            />

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
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`measurements.custom.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Nom de la mesure</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: Hauteur buste" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`measurements.custom.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="w-28">
                        <FormLabel>Valeur ({unit})</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="27" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", value: "" })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter une mesure
              </Button>
            </div>
        </div>

        <div className="flex justify-end pt-4">
            <Button type="submit">{pattern ? "Enregistrer les modifications" : "Créer le patron"}</Button>
        </div>
      </form>
    </Form>
  )
}
