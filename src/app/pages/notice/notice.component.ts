import { AuthService } from 'src/app/Services/auth.service';
import { Notice } from './../models/notice.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoticeService } from 'src/app/Services/notice.service';
import { UserLoginService } from 'src/app/Services/user-login.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {

  noticeBoardList: Notice[] = [];
  showLoader = false;
  p = 1;

  private _searchTitle: string;
  filteredNoticeList: Notice[];

  constructor(private router: Router, private noticeService: NoticeService, public userLoginService: UserLoginService,
    public authService: AuthService) { }

  get searchTitle(): string {
    return this._searchTitle;
  }

  set searchTitle(value: string) {
    this._searchTitle = value;
    this.filteredNoticeList = this.filterTitle(value);
  }

  ngOnInit() {
    this.showLoader = true;
    this.noticeService.getNoticeBoardList().snapshotChanges().subscribe(
      ((item) => {
        this.noticeBoardList = [];
        item.forEach(element => {
          const y = element.payload.toJSON();
          y['$key'] = element.key;
          this.noticeBoardList.push(y as Notice);
        });
        this.filteredNoticeList = this.noticeBoardList;
        this.showLoader = false;
      }),
      ((err) => {
        this.showLoader = false;
        console.log(err);
      })
    );
  }

  onCreateNotice() {
   this.router.navigate(['/noticeCreate']);
  }

  editButtonClick(index) {
    this.router.navigate(['/editNotice', index]);
  }

  filterTitle(searchTitle: string) {
    return this.noticeBoardList.filter(list =>
      list.noticeTitle.toLowerCase().indexOf(searchTitle.toLowerCase()) !== -1);
  }

}
