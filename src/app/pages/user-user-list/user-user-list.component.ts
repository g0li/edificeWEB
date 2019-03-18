import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Services/users.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
declare let alertify: any;

@Component({
  selector: 'app-user-user-list',
  templateUrl: './user-user-list.component.html',
  styleUrls: ['./user-user-list.component.css']
})
export class UserUserListComponent implements OnInit {
  mainUserList: User[] = [];
  sendUser: User;
  showListLoader = false;
  setIndex = '';
  detailedUser: User;
  salutionList = [];
  p = 1;

  private _searchName: string;
  private _searchBuilding: string;
  private _searchFlat: string;
  filteredUserList: User[];

  constructor(private router: Router, private userService: UserService) { }

  get searchName(): string {
    return this._searchName;
  }
  get searchBuilding(): string {
    return this._searchBuilding;
  }
  get searchFlat(): string {
    return this._searchFlat;
  }

  set searchName(value: string) {
    this._searchName = value;
    this.filteredUserList = this.filterName(value);
  }
  set searchBuilding(value: string) {
    this._searchBuilding = value;
    this.filteredUserList = this.filterBuilding(value);
  }
  set searchFlat(value: string) {
    this._searchFlat = value;
    this.filteredUserList = this.filterFlat(value);
  }

  ngOnInit() {
    this.showListLoader = true;
    const x = this.userService.getMainUserList();
    x.snapshotChanges().subscribe(
      (item => {
        this.mainUserList = [];
        item.forEach(element => {
          const y = element.payload.toJSON();
          y['$key'] = element.key;
          this.mainUserList.push(y as User);
        });
        this.showListLoader = false;
        this.filteredUserList = this.mainUserList;
        console.log(this.mainUserList);
      })
    );

    this.userService.getSalutations().subscribe(
      (response: any) => {
        this.salutionList = response;
       },
      (error) => {
        console.log(error);
      }
    );
  }

  onCancel() {
    alertify.warning('Cancelled');
  }

  showDetails(item: User) {
    this.detailedUser = item;
  }

  filterName(searchName: string) {
    return this.mainUserList.filter(list =>
      list.name.toLowerCase().indexOf(searchName.toLowerCase()) !== -1);
  }

  filterBuilding(searchBuilding: string) {
    return this.mainUserList.filter(list =>
      list.building.toLowerCase().indexOf(searchBuilding.toLowerCase()) !== -1);
  }

  filterFlat(searchFlat: string) {
    return this.mainUserList.filter(list =>
       list.flat.toLowerCase().indexOf(searchFlat.toLowerCase()) !== -1);
  }

}
