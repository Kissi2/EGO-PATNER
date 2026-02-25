export interface Paiement {
  id: number;
  datePaiement: string;
  conducteur: string;
  typeAbonnement: string;
  montant: number;
  gain: number;
}
