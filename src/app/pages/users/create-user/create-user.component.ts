import { User } from './../../models/user.model';
import { AlertifyService } from './../../../Services/alertify.service';

import { UserService } from './../../../Services/users.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  salutionList = [];
  showLoader = false;
  salutationLoader = false;
  mainUserList = [];
  editEmployee: User;
  mode = 'new';

  parkingStatus = [
    {status: 'Yes', value: true},
    {status: 'No', value: false}
  ];

  extraFeatures = ['Gym', 'Pool', 'Club'];
  selectedFeatures = [];

  wheerTypes = [
    {status: '2 Wheeler', value: '2'},
    {status: '4 Wheeler', value: '4'}
  ];

  constructor(private userService: UserService, private _fb: FormBuilder,
      private alertify: AlertifyService, private route: ActivatedRoute,
      public router: Router) { }

  ngOnInit() {
    this.loadSalution();
    this.userService.getMainUserList();
    this.userForm = this._fb.group({
      salutationid: [null, Validators.required],
      name: ['', Validators.required],
      flat: ['', Validators.required],
      building: ['', Validators.required],
      housetype: ['', Validators.required],
      parking: ['true', Validators.required],
      selectionFeature: this.addExtraFeatureControls(),
      slotno: [''],
      stickerno: [''],
      vmodel: [''],
      twofourwheel: ['4'],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      emailid: ['', [Validators.required, Validators.email]],
      landline: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      carpetarea: [0, Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.mode = 'edit';
        this.getUser(userId);
      }
    });
  }

  loadSalution() {
    this.salutationLoader = true;
    this.userService.getUserCount();
    this.userService.getSalutations().subscribe(
      (response: any) => {
        this.salutationLoader = false;
        console.log('response => ', response);
        this.salutionList = response;
       },
      (error) => {
        this.salutationLoader = false;
        this.alertify.error(error);
      }
    );
  }

  addExtraFeatureControls() {
    const arr = this.extraFeatures.map((element, index) => {
      return this._fb.control(false);
    });
    return this._fb.array(arr);
  }

  get ExtraFeaturesArray() {
    return <FormArray>this.userForm.get('selectionFeature');
  }

  getSelectedFeatures() {
    this.selectedFeatures = [];
    this.ExtraFeaturesArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedFeatures.push(this.extraFeatures[i]);
      }
    });
  }

  onSubmit() {
    this.showLoader = true;
    this.userService.getUserCount();
    if (this.mode !== 'edit') {
      const email = this.userForm.value.emailid;
      const password = this.userForm.value.password;
      this.userService.registerUser(email, password)
      .then(registeredUser => {
        const id = registeredUser.user.uid;
        const extrafeatures: string = this.selectedFeatures.toString();
        this.userService.insertMainUserList({...this.userForm.value, extrafeatures: extrafeatures}, id)
        .then(() => {
          this.showLoader = false;
          this.alertify.success('User creation successful!');
          this.userService.incrementUser();
          this.router.navigate(['/users']);
        })
        .catch(err => {
          this.showLoader = false;
          console.log(err);
          this.alertify.error('Oops some error occured');
        })
      })
      .catch(err => {
        this.showLoader = false;
        console.log(err);
        const errorCode = err.code;
        const errorMessage = err.message;
        if (errorCode === 'auth/weak-password') {
          this.alertify.error('The password is too Weak');
        } else {
          this.alertify.error(errorMessage);
        }
      });
    } else {
      this.getSelectedFeatures();
       const extrafeatures: string = this.selectedFeatures.toString();
       this.userService.editUser({...this.userForm.value, extrafeatures: extrafeatures, editId: this.editEmployee.$key})
       .then(() => {
         this.showLoader = false;
         this.alertify.success('User Updation Successful');
         this.router.navigate(['/users']);
       })
       .catch((err) => {
         this.showLoader = false;
         console.log(err);
         this.alertify.error('Oops some error occured');
       });
    }
  }

  getUser(key) {
    this.userService.getUser(key).subscribe(
      (user: User) => {
        this.editEmployee = user;
        this.editEmployee.$key = key;
        this.editUser(this.editEmployee);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  editUser(user: User) {
    if (this.mode === 'edit') {
      this.userForm.get('emailid').disable();
    }
    this.userForm.patchValue({
      salutationid: user.salutationid,
      name: user.name,
      flat: user.flat,
      building: user.building,
      housetype: user.housetype,
      parking: user.parking,
      selectionFeature: user.selectionFeature,
      slotno: user.slotno,
      stickerno: user.stickerno,
      vmodel: user.vmodel,
      twofourwheel: user.twofourwheel,
      mobile: user.mobile,
      emailid: user.emailid,
      landline: user.landline,
      password: user.password,
      carpetarea: user.carpetarea
    });
  }

}
