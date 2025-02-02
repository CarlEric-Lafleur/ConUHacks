export interface PosologyInfo {
  frequence: string;
  renew: boolean;
  pharmacy_address: string;
  pharmacy_phone: string;
  pharmacy_name: string;
  quantity: number;
  start_date: string;
  end_date: string;
  interval: Interval;
  drug_name: string;
  description: string;
}

export type Interval = 'semaine' | 'jour';
