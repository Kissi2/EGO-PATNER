export interface Vehicle {
  marque: string;
  modele: string;
  plaque: string;
}

export interface Driver {
  id: number;
  nomComplet: string;
  telephone: string;
  photo: string;
  statut: 'Actif' | 'Inactif' | 'En attente';
  genre: string;
  abonne: 'OUI' | 'NON';
  journee: 'OUI' | 'NON';
  creeLe: string;
  permis: string;
  vehicules: Vehicle[];
}
