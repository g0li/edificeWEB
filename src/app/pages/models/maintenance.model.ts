export class MaintenanceHeader {
  billfor: string;
  building: string;
  date: Date;
  flat: string;
  carpetarea: string;
  housetype: string;
  resident: string;
  $key: string;
}

export class Bill {
  amount: number;
  particular: string;
}

export class Maintenance {
  $key: string;
  header: MaintenanceHeader;
  bill: Bill[];
  id: string;
  interest: number;
  payable: number;
  pending: number;
  status: string;
  subtotal: number;
  totalbill: number;
}
