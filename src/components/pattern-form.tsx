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
import type { Pattern } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  'measurements.tourDePoitrine': z.string().optional(),
  'measurements.tourDeTaille': z.string().optional(),
  'measurements.tourDeHanches': z.string().optional(),
  'measurements.longueurBras': z.string().optional(),
  'measurements.longueurJambe': z.string().optional(),
  'measurements.carrureDos': z.string().optional(),
})

type PatternFormValues = z.infer<typeof formSchema>

interface PatternFormProps {
  pattern?: Pattern;
  onFinished?: () => void;
}

export default function PatternForm({ pattern, onFinished }: PatternFormProps) {
  const form = useForm<PatternFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: pattern ? {
        name: pattern.name,
        'measurements.tourDePoitrine': pattern.measurements.tourDePoitrine || "",
        'measurements.tourDeTaille': pattern.measurements.tourDeTaille || "",
        'measurements.tourDeHanches': pattern.measurements.tourDeHanches || "",
        'measurements.longueurBras': pattern.measurements.longueurBras || "",
        'measurements.longueurJambe': pattern.measurements.longueurJambe || "",
        'measurements.carrureDos': pattern.measurements.carrureDos || "",
    } : {
      name: "",
      'measurements.tourDePoitrine': "",
      'measurements.tourDeTaille': "",
      'measurements.tourDeHanches': "",
      'measurements.longueurBras': "",
      'measurements.longueurJambe': "",
      'measurements.carrureDos': "",
    },
  })

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
            <h3 className="text-base font-medium mb-4 text-foreground">Mensurations</h3>
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

        <div className="flex justify-end pt-4">
            <Button type="submit">{pattern ? "Enregistrer les modifications" : "Créer le patron"}</Button>
        </div>
      </form>
    </Form>
  )
}
