import { AlertifyService } from './alertify.service';
import { User } from '../pages/models/user.model';
import { Salution} from './../pages/models/salution.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable()
export class UserService {

  public salutionList: Salution[] = [];
  public userCount: number;
  public newUserId: string;
  genUserId: string;
  mainUserList: AngularFireList<any>;
  userId: string;

  constructor(private http: HttpClient, private db: AngularFireDatabase, private alertify: AlertifyService,
              private afAuth: AngularFireAuth) {}

  getSalutations() {
    return this.db.list('demo-edifice/salutations').valueChanges();
  }

  getUserCount() {
   return this.http.get('https://edifice-5a9a1.firebaseio.com/demo-edifice/usercount.json').subscribe((response: any) => {
      this.userCount = response;
      if (this.userCount) {
        this.userCount ++;
        if (this.userCount < 10) {
          this.newUserId = 'user-0' + this.userCount;
          this.genUserId = 'gs0' + this.userCount + '_';
        } else {
          this.newUserId = 'user-' + this.userCount;
          this.genUserId = 'gs' + this.userCount + '_';
        }
      }
    });

  }

  // CreateUser(user: User) {
  //   if (user['$key']) { delete user['$key']; }
  //   console.log('New User ID Gen => ' + this.newUserId);
  //   const id = this.genUserId + user['name'];
  //   const saveId = id.toString().replace(/ /g, '_');
  //   console.log({...user, id: this.newUserId, username: saveId});
  //   this.insertMainUserList({...user, 'user-id': this.newUserId , username: saveId});
  // }

  // Register User
  registerUser(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    // .then(registeredUser => {
    //   this.userId = registeredUser.user.uid;
    // })
    // .catch(err => {
    //   console.log(err);
    //   const errorCode = err.code;
    //   const errorMessage = err.message;
    //   if (errorCode === 'auth/weak-password') {
    //     this.alertify.error('The password is too Weak');
    //   } else {
    //     this.alertify.error(errorMessage);
    //   }
    // });
  }
  // Register User


  incrementUser() {
    this.db.list('demo-edifice').set('usercount', this.userCount);
  }

  getMainUserList() {
    this.mainUserList = this.db.list('demo-edifice/users');
    return this.mainUserList;
  }

  insertMainUserList(user: any, uid: any) {
    return this.mainUserList.set(uid, user);
  }

  getUser(key) {
    return this.db.object('demo-edifice/users/' + key).valueChanges();
  }

  editUser(user) {
    console.log(user);
    if (user['$key']) { delete user['$key']; }
    const editId = user.editId;
    console.log(editId);
    return this.mainUserList.update(editId , user);
  }

  deleteUser(id) {
    this.mainUserList.remove(id);
    this.getCount().subscribe(
      (item) => {
        const count: number = item.length;
        this.setCount(count);
      },
      (error) => {console.log(error); }
    );
  }

  getCount() {
   return this.mainUserList.valueChanges();
  }


  setCount(count) {
    this.db.list('demo-edifice').set('usercount', count);
  }

  getUsername(id) {
    return this.db.object('demo-edifice/users/' + id + '/name').valueChanges();
  }

  getFlatNo(id) {
    return this.db.object('demo-edifice/users/' + id + '/flat').valueChanges();
  }

  getHouseType(id) {
    return this.db.object('demo-edifice/users/' + id + '/housetype').valueChanges();
  }

  getBuilding(id) {
    return this.db.object('demo-edifice/users/' + id + '/building').valueChanges();
  }

  getCarpetArea(id) {
    return this.db.object('demo-edifice/users/' + id + '/carpetarea').valueChanges();
  }

  editUserProfile(key, user: User) {
    this.db.object('demo-edifice/users/' + key + '/vmodel').set(user.vmodel);
    this.db.object('demo-edifice/users/' + key + '/mobile').set(user.mobile);
    this.db.object('demo-edifice/users/' + key + '/emailid').set(user.emailid);
    return this.db.object('demo-edifice/users/' + key + '/landline').set(user.landline);
  }

}
