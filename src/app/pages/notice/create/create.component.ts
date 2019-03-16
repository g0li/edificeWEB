import { Notice } from './../../models/notice.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../../../Services/alertify.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NoticeService } from 'src/app/Services/notice.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  noticeForm: FormGroup;
  noticeTypes = [];
  datepickerConfig: Partial<BsDatepickerConfig>;
  showLoader = false;
  mode = 'new';
  editNotice: Notice;

  constructor(private noticeService: NoticeService, private _fb: FormBuilder,
      private alertify: AlertifyService, private router: Router, private route: ActivatedRoute) {
    this.datepickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD-MM-YYYY'
    });
  }

  ngOnInit() {
    this.getNoticeTypes();
    this.noticeService.getNoticeBoardCount();
    this.noticeService.getNoticeBoardList();
    this.noticeForm = this._fb.group({
      noticeTitle: [],
      date: [],
      noticeType: [],
      noticeText: []
    });

    this.route.paramMap.subscribe(
      ((params) => {
        const noticeId = params.get('id');
        if(noticeId) {
          this.mode = 'edit';
          this.getNotice(noticeId);
        }
      })
    );
  }

  getNoticeTypes() {
    this.noticeService.getNoticeType().valueChanges().subscribe(
      ((item) => {
        this.noticeTypes = item;
        console.log('noticeTypes => ', this.noticeTypes);
      }),
      ((err) => {
        console.log(err);
      })
    );
  }

  onSubmit() {
    this.showLoader = true;

    if(this.mode !== 'edit') {
      const day: string = this.noticeForm.value.date.toString();
      const dayName = day.split(' ')[0];
      this.noticeForm.value.date = new DatePipe('en-US').transform(this.noticeForm.value.date, 'dd-MM-yyyy');
      this.noticeService.setNoticeBoard({... this.noticeForm.value, 'day': dayName}).catch(
        () => {
          this.showLoader = false;
          this.alertify.success('Notice creation successful');
        }
      ).catch(
        () => {
          this.alertify.error('Some error occured');
        }
      );
    } else {
      const day: string = this.noticeForm.value.date.toString();
      const dayName = day.split(' ')[0];
      if (this.noticeForm.get('date').dirty) {
        this.noticeForm.value.date = new DatePipe('en-US').transform(this.noticeForm.value.date, 'dd-MM-yyyy');
      }
      this.noticeService.editNotice({... this.noticeForm.value, 'day': dayName, 'id': this.editNotice.$key}).then(
        () => {
          this.showLoader = false;
          this.alertify.success('Notice Updation successful');
        }
      ).catch(
        () => {
          this.showLoader = false;
          this.alertify.error('Some error occured');
        }
      );
    }
    this.router.navigate(['/notice']);
  }

  onCancel() {
    this.router.navigate(['/notice']);
  }

  getNotice(id) {
    this.noticeService.getNotice(id).subscribe(
      ((notice: Notice) => {
        this.editNotice = notice;
        this.editNotice.$key = id;
        this.edit(this.editNotice);
      }),
      ((err) => {
        console.log(err);
      })
    );
  }

  edit(notice: Notice) {
    this.noticeForm.patchValue({
      noticeTitle: notice.noticeTitle,
      date: notice.date,
      noticeType: notice.noticeType,
      noticeText: notice.noticeText
    });
  }
}
