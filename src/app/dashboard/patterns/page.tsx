"use client";

import { useEffect, useState } from 'react';
import { getPatterns } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Ruler } from 'lucide-react';
import type { Pattern } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatterns() {
      const fetchedPatterns = await getPatterns();
      setPatterns(fetchedPatterns);
      setLoading(false);
    }
    fetchPatterns();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline">Mes Patrons</h1>
        <p className="text-muted-foreground">
          Gérez vos modèles de mensurations réutilisables.
        </p>
      </div>
      <Card>
        <CardHeader>
            <div className='flex justify-between items-center'>
                <CardTitle>Liste des patrons</CardTitle>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un patron
                </Button>
            </div>
            <CardDescription>Créez et modifiez vos patrons pour accélérer la création de commandes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du patron</TableHead>
                  <TableHead>Mensurations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patterns.map((pattern) => (
                  <TableRow key={pattern.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{pattern.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {Object.entries(pattern.measurements)
                          .filter(([, value]) => value)
                          .map(([key, value]) => (
                            <span key={key}>
                              {key.replace(/([A-Z])/g, ' $1').replace('tour De', 'T.').replace('longueur', 'L.').replace('carrure', 'C. ')}: <strong>{value}</strong>cm
                            </span>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
