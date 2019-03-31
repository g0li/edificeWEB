import { UserService } from './../../../Services/users.service';
import { AlertifyService } from './../../../Services/alertify.service';
import { ComplaintsService } from './../../../Services/complaints.service';
import { Complaints } from './../../models/complaints.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-complaint',
  templateUrl: './create-complaint.component.html',
  styleUrls: ['./create-complaint.component.css']
})
export class CreateComplaintComponent implements OnInit {
  complaintForm: FormGroup;
  mainComplaint: Complaints;
  complaintStatuses = [];
  complaintCategories = [];
  datepickerConfig: Partial<BsDatepickerConfig>;
  editedComplaint: Complaints;
  showLoader = false;
  userName;
  userKey;

  constructor(private route: ActivatedRoute, private _fb: FormBuilder,
      private complaintService: ComplaintsService, private router: Router,
        private alertify: AlertifyService, private userSerivce: UserService) {
        this.datepickerConfig = Object.assign({}, {
          containerClass: 'theme-dark-blue',
          dateInputFormat: 'DD-MM-YYYY'
        });
       }

  ngOnInit() {
    this.userKey = localStorage.getItem('userToken');
    this.complaintService.getComplaintCount(this.userKey);

    this.userSerivce.getUsername(this.userKey).subscribe((item) => {
      this.userName = item;
    });

    this.complaintForm = this._fb.group({
      title: ['', Validators.required],
      residentName: [],
      date: ['', Validators.required],
      category: [],
      complaint: ['', Validators.required],
    });

    this.complaintService.getComplaintStatus().subscribe(
      ((response) => {
        this.complaintStatuses = response;
      }),
      ((err) => {
        console.log(err);
      })
    );

    this.complaintService.getComplaintCategories().subscribe(
      ((response) => {
        this.complaintCategories = response;
      }),
      ((err) => {
        console.log(err);
      })
    );


  }


  onSubmit() {
    this.showLoader = true;
    this.complaintForm.value.date = new DatePipe('en-US').transform(this.complaintForm.value.date, 'dd-MM-yyyy');
    this.complaintForm.value.residentName = this.userName;
    this.complaintService.insertComplaiont({...this.complaintForm.value, status: '1'}, this.userKey).then(
      () => {
        this.showLoader = false;
        this.alertify.success('Complaint Created');
      }
    ).catch(
      () => {
        this.showLoader = false;
        this.alertify.error('Opps some error occured');
      }
    );
    this.router.navigate(['/userComplaints']);
  }

  onCancel() {
    this.router.navigate(['/userComplaints']);
  }


}
