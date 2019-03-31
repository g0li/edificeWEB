import { Router } from '@angular/router';
import { AlertifyService } from './../../Services/alertify.service';
import { MaintenanceService } from './../../Services/maintenance.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/Services/users.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Particulars } from '../models/particulars.model';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {

  maintenanceForm: FormGroup;
  bulkMaintenanceForm: FormGroup;
  userNameDD = [];
  selectedUserName: any;
  selectedUserHouseType: any;
  selectedUserFlatNo: any;
  selectedUserBuilding: any;
  selectedUserCarpetArea: any;
  monthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  particulrs: Particulars[] = [];
  maintenanceCount: number;
  showLoader = false;
  billsFor = [];
  datepickerConfig: Partial<BsDatepickerConfig>;
  amount = 0;
  autoTotalAmount = 0;
  bulkTotalAmount = '';
  // Bulk
  selectAllUsers = true;
  selectedUsersArr = [];


  constructor(private _fb: FormBuilder, private mtcService: MaintenanceService,
      private userService: UserService, private alertify: AlertifyService,
        private router: Router) {
          this.datepickerConfig = Object.assign({}, {
            containerClass: 'theme-dark-blue',
            dateInputFormat: 'DD-MM-YYYY'
          });
        }

  ngOnInit() {
    const billAmounts = [];
    this.getParticulars();
    this.getBillsFor();
    this.maintenanceForm = this._fb.group({
      resident: [null, Validators.required],
      flat: ['', Validators.required],
      housetype: ['', Validators.required],
      carpetarea: ['', Validators.required],
      billfor: [null, Validators.required],
      date: ['', Validators.required],
      building: ['', Validators.required],
      bill: this._fb.array([this.addBillGroup()]),
      id: [],
      interest: [],
      payable: [0],
      pending: [0],
      status: ['Posted'],
      subtotal: [this.autoTotalAmount],
      totalbill: [0]
    });
    this.maintenanceForm.get('bill').disable();

    // this.bulkMaintenanceForm = this._fb.group({
    //   selectAll: [this.selectAllUsers],
    //   resident: [{value: null, disabled: true}, Validators.required],
    //   billfor: [null, Validators.required],
    //   date: ['', Validators.required],
    //   bill: this._fb.array([this.addBulkBillGroup()]),
    //   id: [],
    //   interest: [0],
    //   total: ['']
    // });

    this.mtcService.userNameDD().subscribe((item => {
      item.forEach(element => {
        const x = element.payload.toJSON();
        x['$key'] = element.key;
        this.userNameDD.push({'username': x['name'], 'userid': x['$key']});
      });
      console.log('usernameddd', this.userNameDD);
    })


      // ((response: any) => {
      //   const arr = Object.values(response);
      //   arr.forEach((element, index) => {
      //     this.userNameDD.push({'id' : index, 'username' : element['name'], 'userid' : element.});
      //   })
      //   console.log('Username DD => ', this.userNameDD);
      // }),
      // ((err) => {
      //   console.log(err);
      // })
    );
  }

  onCreate() {}

  // Single User
  addNewBill() {
    this.billArray.push(this.addBillGroup());
  }

  // Bulk
  // addNewBillBulk() {
  //   this.bulkBillArray.push(this.addBulkBillGroup());
  // }

  removeBill(index) {
    this.billArray.removeAt(index);
    this.calcAmount();
  }

  // Bulk
  // removeBillBulk(index) {
  //   this.bulkBillArray.removeAt(index);
  //   this.calcBulkAmount();
  // }

  addBillGroup() {
    return this._fb.group({
      particular: [null, Validators.required],
      amount: [this.amount]
    });
  }

  // addBulkBillGroup() {
  //   return this._fb.group({
  //     particular: [null, Validators.required],
  //     amount: [0]
  //   })
  // }

  get billArray() {
    return <FormArray>this.maintenanceForm.get('bill');
  }

  // get bulkBillArray() {
  //   return <FormArray>this.bulkMaintenanceForm.get('bill');
  // }

  getParticulars() {
    this.mtcService.getParticulars().snapshotChanges().subscribe(
      ((item) => {
        item.forEach(element => {
          const x = element.payload.toJSON();
          x['$key'] = element.key;
          this.particulrs.push(x as Particulars);
        });
      })
    );
  }

  getBillsFor() {
    this.mtcService.getBillFor().valueChanges().subscribe(
    ((item => {
      this.billsFor = item;
    }))
    );
  }

  onSubmit() {
    this.showLoader = true;
    this.maintenanceForm.value.date = new DatePipe('en-US').transform(this.maintenanceForm.value.date, 'dd-MM-yyyy');
    const path = this.maintenanceForm.value.resident;
    const d = new Date();
    const year = d.getFullYear();
    const fory: string = this.maintenanceForm.value.billfor;
    const id = fory.toUpperCase() + year;
    this.maintenanceForm.value.resident = this.selectedUserName;
    this.mtcService.createMaintenance({... this.maintenanceForm.value, 'path': path, 'count' : this.maintenanceCount, id: id})
    .then(
      () => {
        this.showLoader = false;
        this.alertify.success('Maintainence bill created');
        this.router.navigate(['/maintenanceList']);
      }
    ).catch(
      (err) => {
        this.alertify.error('Some error occured');
      }
    );

  }

  OnSelectedUserName() {
    const q = this.maintenanceForm.get('resident').value;
    if (q === null) {
      this.maintenanceForm.get('bill').disable();
    } else {
      this.maintenanceForm.get('bill').enable();
    }
    console.log(q);
    this.userService.getUsername(q).subscribe(
      ((username) => {
        this.selectedUserName = username;
        console.log(this.selectedUserName);
      }),
      ((err) => {
        this.alertify.error('Some error occured');
      })
    );

    this.userService.getFlatNo(q).subscribe(
      ((flat) => {
        this.selectedUserFlatNo = flat;
        this.maintenanceForm.get('flat').setValue(this.selectedUserFlatNo);
      }),
      ((err) => {
        this.alertify.error('Some error occured');
      })
    );

    this.userService.getHouseType(q).subscribe(
      ((houseType) => {
        this.selectedUserHouseType = houseType;
        this.maintenanceForm.get('housetype').setValue(this.selectedUserHouseType);
      }),
      ((err) => {
        this.alertify.error('Some error occured');
      })
    );

    this.userService.getBuilding(q).subscribe(
      ((building) => {
        this.selectedUserBuilding = building;
        this.maintenanceForm.get('building').setValue(this.selectedUserBuilding);
      }),
      ((err) => {
        this.alertify.error('Some error occured');
      })
    );

    this.userService.getCarpetArea(q).subscribe(
      ((carpetArealding) => {
        this.selectedUserCarpetArea = carpetArealding;
        this.maintenanceForm.get('carpetarea').setValue(this.selectedUserCarpetArea);
      }),
      ((err) => {
        this.alertify.error('Some error occured');
      })
    );

    this.mtcService.getUserMaintenanceCount(q).subscribe(
      ((item) => {
        this.maintenanceCount = item.length;
        console.log('maintenance count ', this.maintenanceCount);
      }),
      ((err) => {
        this.maintenanceCount = 0;
      })
    );

  }

  onCancel() {
    this.router.navigate(['/maintenanceList']);
  }

  onParticularSelect(event, index) {
    const prt = event.target.value;
    let val = 0;
    for (let item of this.particulrs) {
      if (item.particular === prt) {
        val = item.baseprice * +this.selectedUserCarpetArea;
      }
    }
    (<FormArray>this.maintenanceForm.get('bill')).controls[index].get('amount').patchValue(val);
    this.calcAmount();
  }

  // onBulkParticularSelect(event, index) {
  //   const prt = event.target.value;
  //   let val = 0;
  //   for (let item of this.particulrs) {
  //     if (item.particular === prt) {
  //       val = item.baseprice;
  //     }
  //   }
  //   (<FormArray>this.bulkMaintenanceForm.get('bill')).controls[index].get('amount').patchValue(val);
  //   this.calcBulkAmount();
  // }

  calcAmount() {
    let totalA = 0;
    for (let item of (<FormArray>this.maintenanceForm.get('bill')).controls) {
      totalA = totalA + (item.get('amount').value);
    }

    this.autoTotalAmount = totalA;
    this.maintenanceForm.get('subtotal').patchValue(this.autoTotalAmount);
    this.maintenanceForm.get('totalbill').patchValue(this.autoTotalAmount);
  }

  // calcBulkAmount() {
  //   let tot = 0;
  //   let totalA = '';
  //   for (let item of (<FormArray>this.bulkMaintenanceForm.get('bill')).controls) {
  //     tot = tot + (item.get('amount').value);
  //   }
  //   totalA = tot + '* Carpet Area';
  //   this.bulkTotalAmount = totalA;
  //   this.bulkMaintenanceForm.get('total').patchValue(this.bulkTotalAmount);
  // }

  checkValue(event: any) {
    this.selectAllUsers = this.bulkMaintenanceForm.get('selectAll').value;
    const selectCtrl = this.bulkMaintenanceForm.get('resident');
    if (this.selectAllUsers) {
      selectCtrl.disable();
    } else {
      selectCtrl.enable();
    }
  }

  getAllUserIDs() {
    const userIdArray = [];
    this.userNameDD.forEach(element => {
      userIdArray.push(element.userid);
    });
    return userIdArray;
  }

  // onBulkSubmit() {
  //   debugger;
  //   this.selectedUsersArr = [];
  //   this.bulkMaintenanceForm.value.date = new DatePipe('en-US').transform(this.bulkMaintenanceForm.value.date, 'dd-MM-yyyy');
  //   const d = new Date();
  //   const year = d.getFullYear();
  //   const fory: string = this.bulkMaintenanceForm.value.billfor;
  //   const id = fory.toUpperCase() + year;
  //   this.selectAllUsers = this.bulkMaintenanceForm.get('selectAll').value;
  //   if (this.selectAllUsers) {
  //     this.bulkMaintenanceForm.value.resident = this.getAllUserIDs();
  //   }
  //   const selectedUsers: any = this.bulkMaintenanceForm.value.resident;
  //   selectedUsers.forEach(element => {
  //     this.mtcService.getUserMaintenanceCount(element).subscribe(
  //       (item => {
  //         this.userService.getUser(element).subscribe((user) => {
  //           const id = element;
  //           const count = item.length;
  //           const carpetarea = user['carpetarea'];
  //           const building = user['building'];
  //           const housetype = user['housetype'];
  //           const flat = user['flat'];
  //           const residentName = user['name'];
  //           this.selectedUsersArr.push({id, count, carpetarea, building, housetype, flat, residentName });
  //         });

  //       }),
  //       (err => {
  //         console.log(err);
  //         this.alertify.error('Oops some error occured');
  //       })
  //     );
  //   });


  //   for (let item of this.selectedUsersArr) {
  //     const path = item.id;
  //     const count = item.count;
  //     const formVal = this.bulkMaintenanceForm.value;
  //     this.mtcService.createBulkMaintenance({...item, ...formVal, 'path': path, count: count, id: id});
  //   }
  // }

}
