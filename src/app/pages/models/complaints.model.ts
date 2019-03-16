export class Complaints {
  $key: string;
  $mainKey: string;
  title: string;
  residentName: string;
  date: string;
  category: string;
  status: string;
  complaint: string;
  Admincomments: string;
}

export class ComplaintsList {
  $key: string;
  complaints: Complaints[];
}
