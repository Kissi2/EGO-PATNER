export interface EvolutionGainPoint {
  label: string;
  value: number;
}

export interface EvolutionGainData {
  labels: string[];
  values: number[];
}

/** Forme normalisée des statistiques du dashboard */
export interface DashboardStats {
  conducteurs: number;
  abonnements: number;
  gains: number;
}
