import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Notice } from '../pages/models/notice.model';
@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  noticeTypeList: AngularFireList<any>;
  noticeBoardList: AngularFireList<any>;
  noticeBoardCount: number;

constructor(private db: AngularFireDatabase) { }

  getNoticeType() {
    this.noticeTypeList = this.db.list('demo-edifice/notice-type');
    return this.noticeTypeList;
  }

  getNoticeBoardCount() {
    this.db.list('demo-edifice/notice-board').valueChanges().subscribe(
      ((item) => {
        this.noticeBoardCount = item.length;
      }),
      ((err) => {
        console.log(err);
      })
    );
  }

  getNoticeBoardList() {
    this.noticeBoardList = this.db.list('demo-edifice/notice-board');
    return this.noticeBoardList;
  }

  setNoticeBoard(notice: Notice) {
    if (notice['$key']) {delete notice['$key']}
    return this.noticeBoardList.set(this.noticeBoardCount.toString(), notice);
  }

  getNotice(id) {
    return this.db.object('demo-edifice/notice-board/' + id).valueChanges();
  }

  editNotice(notice) {
    const id = notice['id'];
    delete notice['id'];
    return this.noticeBoardList.update(id, notice);

  }

}
