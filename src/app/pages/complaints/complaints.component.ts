import { ComplaintsService } from './../../Services/complaints.service';


import { Component, OnInit } from '@angular/core';
import { ComplaintsList, Complaints } from '../models/complaints.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnInit {
  complaintList: ComplaintsList[] = [];
  complaint: Complaints[];
  allComplaints: Complaints[];
  complaintCategories = [];
  detailsComplaint: Complaints;
  showLoader = false;
  p = 1;

  private _searchTitle: string;
  private _searchName: string;
  filteredComplaintList: Complaints[];

  constructor(private complaintService: ComplaintsService, private router: Router) { }

  get searchTitle(): string {
    return this._searchTitle;
  }

  get searchName(): string {
    return this._searchName;
  }

  set searchTitle(value: string) {
    this._searchTitle = value;
    this.filteredComplaintList = this.filterTitle(value);
  }

  set searchName(value: string) {
    this._searchName = value;
    this.filteredComplaintList = this.filterName(value);
  }

  ngOnInit() {
    this.showLoader = true;
    this.complaintService.getComplaintList().snapshotChanges().subscribe(
      ((item) => {
        this.showLoader = false;
        this.complaintList = [];
        this.allComplaints = [];
        item.forEach(element => {
          const y = {};
          y['$key'] = element.payload.key;
          this.complaintService.getComplaints(y['$key']).snapshotChanges().subscribe(
            ((cmp) => {
              this.complaint = [];
              cmp.forEach(el => {
                const x = el.payload.toJSON();
                x['$key'] = el.payload.key;
                x['$mainKey'] = y['$key'];
                this.complaint.push(x as Complaints);
              });
              y['complaints'] = this.complaint;
              for(let comp of this.complaint) {
                this.allComplaints.push(comp);
              }
              console.log(this.allComplaints);
              this.filteredComplaintList = this.allComplaints;
            }),
            ((error) => {
              console.log(error);
            })
          );
          this.complaintList.push(y as ComplaintsList);
        })
      }),
      ((err) => {
        this.showLoader = false;
        console.log(err);
      })
    );

    this.complaintService.getComplaintCategories().subscribe(
      ((item) => {
        this.complaintCategories = item;
      }),
      ((err) => {
        console.log(err);
      })
    )
  }

  displayStatus(status) {
    if (status === '1') {
      return 'Created';
    } else if (status === '2') {
      return 'Solved';
    } else if (status === '3') {
      return 'Not Solved';
    }
  }

  displayCategory(cat) {
    for(let i = 0; i < this.complaintCategories.length; i++) {
      if (cat === i) {
        return this.complaintCategories[i];
      }
    }
  }

  showDetail(complaint: Complaints) {
    this.detailsComplaint = complaint;
  }

  editComplaint(index, key) {
    this.router.navigate(['/editcomplaints' , {id: index, mainid: key}]);
  }

  filterTitle(searchTitle: string) {
    return this.allComplaints.filter(list =>
      list.title.toLowerCase().indexOf(searchTitle.toLowerCase()) !== -1);
  }

  filterName(searchName: string) {
    return this.allComplaints.filter(list =>
      list.residentName.toLowerCase().indexOf(searchName.toLowerCase()) !== -1);
  }

}
