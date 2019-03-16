import { AlertifyService } from './../../../Services/alertify.service';
import { ComplaintsService } from './../../../Services/complaints.service';
import { Complaints } from './../../models/complaints.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-complaints',
  templateUrl: './edit-complaints.component.html',
  styleUrls: ['./edit-complaints.component.css']
})
export class EditComplaintsComponent implements OnInit {
  complaintForm: FormGroup;
  mainComplaint: Complaints;
  complaintStatuses = [];
  complaintCategories = [];
  datepickerConfig: Partial<BsDatepickerConfig>;
  editedComplaint: Complaints;
  showLoader = false;

  constructor(private route: ActivatedRoute, private _fb: FormBuilder,
      private complaintService: ComplaintsService, private router: Router,
        private alertify: AlertifyService) {
        this.datepickerConfig = Object.assign({}, {
          containerClass: 'theme-dark-blue',
          dateInputFormat: 'DD-MM-YYYY'
        });
       }

  ngOnInit() {

    this.complaintForm = this._fb.group({
      $key: [],
      $mainKey: [],
      title: [],
      residentName: [],
      date: [],
      category: [],
      status: [],
      complaint: [],
      Admincomments: []
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

      this.route.paramMap.subscribe(
        ((params) => {
          const index = params.get('id');
          const mainIndex = params.get('mainid');
          if(index && mainIndex) {
            this.getComplaint(index, mainIndex);
          }
        })
      );

  }

  getComplaint(index, mainIndex) {
    this.complaintService.getComplaint(index, mainIndex).valueChanges().subscribe(
      ((response: Complaints) => {
        this.editedComplaint = response;
        this.editedComplaint.$key = index;
        this.editedComplaint.$mainKey = mainIndex;
        this.editComplaint(this.editedComplaint);
      }),
      ((err) => {
        console.log(err);
      })
    );
  }

  editComplaint(comp: Complaints) {
    this.complaintForm.patchValue({
      $key: comp.$key,
      $mainKey: comp.$mainKey,
      title: comp.title,
      residentName: comp.residentName,
      date: comp.date,
      category: comp.category,
      status: comp.status,
      complaint: comp.complaint,
      Admincomments: comp.Admincomments
    });
  }

  onSubmit() {
    this.showLoader = true;
    if (this.complaintForm.get('date').dirty) {
      this.complaintForm.value.date = new DatePipe('en-US').transform(this.complaintForm.value.date, 'dd-MM-yyyy');
    }
    console.log(this.complaintForm.value);
    this.complaintService.updateComplaint(this.complaintForm.value).then(
      () => {
        this.showLoader = false;
        this.alertify.success('Complaint updated');
      }
    ).catch(
      () => {
        this.showLoader = false;
        this.alertify.error('Opps some error occured');
      }
    );
    this.router.navigate(['/complaints']);
  }

  onCancel() {
    this.router.navigate(['/complaints']);
  }

}
