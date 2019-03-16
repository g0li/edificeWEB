import { Complaints } from './../pages/models/complaints.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {

  complaintList: AngularFireList<any>;
  userComplaintCount: number;

 constructor(private db: AngularFireDatabase) { }

  getComplaintList() {
    this.complaintList = this.db.list('demo-edifice/complaints');
    return this.complaintList;
  }

  getComplaints(key) {
    return this.db.list('demo-edifice/complaints/' + key);
  }

  getComplaintCategories() {
    return this.db.list('demo-edifice/complaint-types').valueChanges();
  }

  getComplaintStatus() {
    return this.db.list('demo-edifice/complaint-status').valueChanges();
  }

  getComplaint(id, mainId) {
    return this.db.object('demo-edifice/complaints/' + mainId + '/' + id);
  }

  updateComplaint(data: Complaints) {
    const mainId = data.$mainKey;
    const id = data.$key;
    if (data.$key) { delete data.$key; }
    if (data.$mainKey) { delete data.$mainKey; }
    return this.db.object('demo-edifice/complaints/' + mainId + '/' + id).set(data);
  }

  getComplaintCount(key) {
    const complaintCount =  this.db.list('demo-edifice/complaints/' + key).valueChanges().subscribe(
      ((item) => {
        this.userComplaintCount = item.length;
      }),
      ((err) => {
        console.log(err);
      })
    );
  }

  insertComplaiont(complaint: Complaints, key) {
    console.log('User complaint count', this.userComplaintCount);
    return this.db.object('demo-edifice/complaints/' + key + '/' + this.userComplaintCount).set(complaint);
  }

}
