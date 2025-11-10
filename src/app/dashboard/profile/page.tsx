import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-headline">Mon Profil</h1>
        <p className="text-muted-foreground">
          Gérez les informations de votre atelier et de votre compte.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'atelier</CardTitle>
          <CardDescription>
            Ces informations sont utilisées pour personnaliser votre expérience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
             <Avatar className="h-20 w-20">
                <AvatarImage src="https://picsum.photos/seed/avatar/100/100" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Button variant="outline">Changer la photo</Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workshopName">Nom de l'atelier</Label>
              <Input id="workshopName" defaultValue="Atelier Chic" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de contact</Label>
              <Input id="contactEmail" type="email" defaultValue="contact@atelier-chic.com" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" defaultValue="01 23 45 67 89" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" defaultValue="15 Rue de la Paix, 75002 Paris" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Enregistrer les modifications</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>
            Gérez votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input id="new-password" type="password" />
            </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Changer le mot de passe</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
