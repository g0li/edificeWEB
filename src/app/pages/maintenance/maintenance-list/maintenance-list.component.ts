import { Maintenance, Bill } from './../../models/maintenance.model';
import { MaintenanceService } from './../../../Services/maintenance.service';
import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
// import * as jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.css'],
})
export class MaintenanceListComponent implements OnInit {

  datepickerConfig: Partial<BsDatepickerConfig>;
  maintenanceDetail: Maintenance;
  detialBill: any;
  showLoader = true;
  p = 1;

  constructor(private mtcService: MaintenanceService, private router: Router) {
    this.datepickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD-MM-YYYY'
    });
   }
  maintenanceList: Maintenance[] = [];

  // Search Filters
  private _searchName: string;
  private _searchBuilding: string;
  private _searchFlat: string;
  private _searchDate: Date;
  filteredMaintenanceList: Maintenance[];

  get searchName(): string {
    return this._searchName;
  }
  get searchBuilding(): string {
    return this._searchBuilding;
  }
  get searchFlat(): string {
    return this._searchFlat;
  }
  get searchDate() {
    return this._searchDate;
  }

  set searchName(value: string) {
    this._searchName = value;
    this.filteredMaintenanceList = this.filterName(value);
  }
  set searchBuilding(value: string) {
    this._searchBuilding = value;
    this.filteredMaintenanceList = this.filterBuilding(value);
  }
  set searchFlat(value: string) {
    this._searchFlat = value;
    this.filteredMaintenanceList = this.filterFlat(value);
  }
  set searchDate(value: Date) {
    this._searchDate = value;
    this.filteredMaintenanceList = this.filterDate(value);
  }

  ngOnInit() {
    this.showLoader = true;
    this.mtcService.getMaintenanceList().snapshotChanges().subscribe(
      ((list) => {
        this.showLoader = false;
        list.forEach(element => {
          const y: any = element.payload.toJSON();
          const x = Object.values(y);
          x.forEach(ele => {
            this.maintenanceList.push(ele as Maintenance);
          });
        });
        this.filteredMaintenanceList = this.maintenanceList;
      }),
      ((err) => {
        this.showLoader = false;
        console.log(err);
      })
    );
  }

  filterName(searchName: string) {
    return this.maintenanceList.filter(list =>
      list.header.resident.toLowerCase().indexOf(searchName.toLowerCase()) !== -1);
  }

  filterBuilding(searchBuilding: string) {
    return this.maintenanceList.filter(list =>
      list.header.building.toLowerCase().indexOf(searchBuilding.toLowerCase()) !== -1);
  }

  filterFlat(searchFlat: string) {
    return this.maintenanceList.filter(list =>
       list.header.flat.toLowerCase().indexOf(searchFlat.toLowerCase()) !== -1);
  }

  filterDate(searchDate: Date) {
    if (!searchDate) {
      return this.maintenanceList;
    } else {
      const date = new DatePipe('en-US').transform(searchDate, 'dd-MM-yyyy');
    return this.maintenanceList.filter(list =>
      list.header.date.toString().indexOf(date) !== -1);
    }
  }

  onCreate() {
    this.router.navigate(['/maintenance']);
  }

  onShowDetail(data: Maintenance, bill: Bill) {
    this.detialBill = Object.values(bill);
    this.maintenanceDetail = data;

    // this.captureScreen();
  }

  // captureScreen() {
  //   const elementToPrint = document.getElementById('downloadModal'); // The html element to become a pdf
  // const pdf = new jsPDF('p', 'pt', 'a4');
  // pdf.addHTML(elementToPrint, () => {
  //   pdf.save('web.pdf');
  // });
  // }

}
