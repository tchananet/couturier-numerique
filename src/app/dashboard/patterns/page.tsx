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
import { Ruler } from 'lucide-react';
import type { Pattern } from '@/lib/types';
import PatternActions from '@/components/pattern-actions';
import { Skeleton } from '@/components/ui/skeleton';

function PatternsLoading() {
    return (
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
                {Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
    )
}

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

  const renderMeasurements = (pattern: Pattern) => {
    const { unit, standard, custom } = pattern.measurements;
    const allMeasurements = [
        ...Object.entries(standard)
            .filter(([, value]) => value)
            .map(([key, value]) => ({ name: key, value })),
        ...(custom || [])
    ];
    
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {allMeasurements.map(({ name, value }, index) => (
            <span key={index} className="whitespace-nowrap">
            {name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('tour De', 'T.').replace('longueur', 'L.').replace('carrure', 'C.')}: <strong>{value}</strong>{unit}
            </span>
        ))}
      </div>
    );
  };

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
                 <PatternActions />
            </div>
            <CardDescription>Créez et modifiez vos patrons pour accélérer la création de commandes.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <PatternsLoading /> : (
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
                            {renderMeasurements(pattern)}
                        </TableCell>
                        <TableCell className="text-right">
                            <PatternActions pattern={pattern} />
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
