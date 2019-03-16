import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  maintenanceList: AngularFireList<any>;

constructor(private db: AngularFireDatabase) { }

  userNameDD() {
    return this.db.list('demo-edifice/users').snapshotChanges();
  }

  createMaintenance(data: any) {
    const path = data['path'];
    const count = data['count'];
    delete data['path'];
    delete data['count'];

    const header = {
      building: data['building'],
      date: data['date'],
      flat: data['flat'],
      carpetarea: data['carpetarea'],
      housetype: data['housetype'],
      resident: data['resident'],
      billfor: data['billfor'],
    };

    delete data['building'];
    delete data['date'];
    delete data['flat'];
    delete data['carpetarea'];
    delete data['housetype'];
    delete data['resident'];
    delete data['billfor'];

    return this.db.object('demo-edifice/maintenance/' + path + '/' + count).set({... data, header});
  }

  getUserMaintenanceCount(id) {
    return this.db.list('demo-edifice/maintenance/' + id).snapshotChanges();
  }

  getMaintenanceList() {
    this.maintenanceList = this.db.list('demo-edifice/maintenance');
    return this.maintenanceList;
  }

  getParticulars() {
    return this.db.list('demo-edifice/particulars');
  }

  getBillFor() {
    return this.db.list('demo-edifice/billsfor');
  }

}
