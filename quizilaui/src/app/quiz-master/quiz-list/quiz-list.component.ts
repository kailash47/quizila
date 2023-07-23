import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuestionService } from 'src/app/services/question/question.service';
import { QuizService } from 'src/app/services/quiz/quiz.service';
import { UsersService } from 'src/app/services/users/users.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'time', 'timeperques', 'updated_at', 'action'];
  datasource: any = {};
  paginator: any = {};

  displayedColumnsQt: string[] = ['select', 'name', 'updated_at'];
  datasourceQt: any = {};
  paginatorQt: any = {};
  selectionQt = new SelectionModel<any>(true, []);

  displayedColumnsQtList: string[] = ['question', 'updated_at', 'action'];
  datasourceQtList: any = {};
  paginatorQtList: any = {};
  selectionQtList = new SelectionModel<any>(true, []);

  displayedColumnsUser: string[] = ['select', 'name', 'mobile', 'email', 'dob', 'group', 'updated_at'];
  datasourceUser: any = {};
  paginatorUser: any = {};
  selectionUser = new SelectionModel<any>(true, []);

  displayedColumnsUserList: string[] = ['name', 'email', 'dob', 'group', 'updated_at', 'action'];
  datasourceUserList: any = {};
  paginatorUserList: any = {};
  selectionUserList = new SelectionModel<any>(true, []);

  displayedColumnsLB: string[] = ['total','name', 'email', 'dob', 'group', 'remarks','updated_at', 'action'];
  datasourceLB: any = {};
  paginatorLB: any = {};

  dialogRef!: MatDialogRef<any>;
  quizFG!: FormGroup;
  selectedItem: any;
  searchKey: FormControl;
  catKey: FormControl;
  remarkKey: FormControl;
  isUpdate: boolean = false;

  searchKeyUser: FormControl;
  // userGroupKey: FormControl;

  showResult: boolean = false;

  @ViewChild('fileUpload') imageUpload!: ElementRef;
  catList: any;
  selectedResult: any;

  quizQuestionMap = new Map();
  quizUserMap = new Map();

  constructor(private rest: QuizService, private restQuestion: QuestionService, private restUser: UsersService, public dialog: MatDialog, private fb: FormBuilder, public utils: UtilsService) {
    this.datasource = {
      data: [],
      count: 0
    };
    this.paginator = { limit: 10, offset: 0 }

    this.datasourceQt = {
      data: [],
      count: 0
    };
    this.paginatorQt = { limit: 10, offset: 0 }

    this.datasourceQtList = {
      data: [],
      count: 0
    };
    this.paginatorQtList = { limit: 10, offset: 0 }

    this.datasourceUser = {
      data: [],
      count: 0
    };
    this.paginatorUser = { limit: 10, offset: 0 }

    this.datasourceUserList = {
      data: [],
      count: 0
    };
    this.paginatorUserList = { limit: 10, offset: 0 }

    this.datasourceLB = {
      data: [],
      count: 0
    };
    this.paginatorLB = { limit: 10, offset: 0 }

    this.searchKey = new FormControl('');
    this.catKey = new FormControl('');
    this.searchKeyUser = new FormControl('');
    this.remarkKey = new FormControl('');
  }

  ngOnInit(): void {
    this.getQuiz();
    this.initFormGroup();
    this.getCatList();
    // this.getUser();
    this.searchKey.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((data) => {
      if (data?.length > 2) {
        this.paginator = { limit: 10, offset: 0 }
        this.getQuiz();
      } else if (data?.length == 0) {
        this.getQuiz();
      }
    })

    this.searchKeyUser.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((data) => {
      if (data?.length > 2) {
        this.paginator = { limit: 10, offset: 0 }
        this.getUser(data);
      } else if (data?.length == 0) {
        this.datasourceUser = {
          data: [],
          count: 0
        };
        this.paginatorUser = { limit: 10, offset: 0 }
      }
    })
  }

  ngOnDestroy() {
    console.log("DESS");
  }

  initFormGroup() {
    this.quizFG = this.fb.group({
      quizname: ['', [Validators.required]],
      quiztime: ['', [Validators.required]],
      timeperques: ['', [Validators.required]],
      instructions: ['', [Validators.required]]
    });
  }

  getQuiz() {
    let params: any = {
      limit: this.paginator.limit,
      offset: this.paginator.offset,
    };
    if (this.searchKey.value) {
      params.search = this.searchKey.value;
    }
    this.rest.getQuiz(params).subscribe(
      (res: any) => {
        if (res.status) {
          this.datasource.data = res.data.rows;
          this.datasource.count = res.data.count;
        }
      },
      (err: any) => {
        console.error(err, "err");
      }
    )
  }

  openDialog(templateRef: any, row: any, action?: any): void {

    this.selectedItem = row;
    let width = '400px';

    if (action === 'update') {
      this.isUpdate = true;
      row.timeperques = row.timeperques ? "true" : "false"
      this.quizFG.patchValue(row);
    } else if (action === 'add') {
      this.quizFG.reset();
      this.isUpdate = false;
    } else if (action === 'addqt') {
      this.quizFG.reset();
      this.isUpdate = false;
      width = "90%";
      this.getQuestionToQuiz(this.selectedItem.id);
    } else if (action === 'addUser') {
      this.quizFG.reset();
      this.isUpdate = false;
      width = "90%";
      this.getUserToQuiz(this.selectedItem.id);
    } else if (action === 'leaderboard') {
      // this.quizFG.reset();
      this.isUpdate = false;
      width = "90%";
      this.getLeaderboard(this.selectedItem.id);
    }

    this.dialogRef = this.dialog.open(templateRef, {
      width: width,
    });
  }

  addQuiz() {
    if (this.quizFG.valid) {
      const data = this.quizFG.value;
      this.rest.addQuiz(data).subscribe(
        (res: any) => {
          console.log(res);
          this.dialogRef?.close();
          this.utils.openSnackBar('Quiz added successfully !');
          this.getQuiz();
        },
        (err: any) => {
          console.error("Error:", err);
        }
      )
    } else {
      this.utils.openSnackBar('Please Fill Required Field', 'Close');
    }

  }

  updateQuiz() {
    if (this.quizFG.valid) {
      const data = { ...this.quizFG.value, id: this.selectedItem.id };
      this.rest.updateQuiz(data).subscribe(
        (res: any) => {
          console.log(res);
          this.dialogRef?.close();
          this.isUpdate = false;
          this.utils.openSnackBar('Quiz updated successfully !');
          this.getQuiz();
        },
        (err: any) => {
          console.error("Error:", err);
        }
      )
    } else {
      this.utils.openSnackBar('Please Fill Required Field', 'Close');
    }

  }

  deleteQuiz() {
    const data = { id: this.selectedItem.id };
    this.rest.deleteQuiz(data).subscribe(
      (res: any) => {
        console.log(res);
        this.dialogRef?.close();
        this.utils.openSnackBar('Quiz deleted successfully !');
        this.getQuiz();
      },
      (err: any) => {
        console.error("Error:", err);
      }
    )
  }

  onPageChange(pageEvent: PageEvent) {
    this.paginator.limit = pageEvent.pageSize;
    this.paginator.offset = this.paginator.limit * pageEvent.pageIndex;
    this.getQuiz();
  }

  getCatList() {
    let params: any = {
      pg: 'false'
    };
    this.restQuestion.getCategory(params).subscribe(
      (res) => {
        if (res.status) {
          this.catList = res.data.rows;
        }
      },
      (err) => {
        console.error(err, "err");
      }
    )
  }

  getQuestion(catEv: any) {
    console.log(catEv);
    let params: any = {
      limit: this.paginator.limit,
      offset: this.paginator.offset,
      cat: this.catKey.value
    };
    if (this.searchKey.value) {
      params.search = this.searchKey.value;
    }
    this.rest.getCatQuestion(params).subscribe(
      (res: any) => {
        if (res.status) {
          this.datasourceQt.data = res.data.qz_questions;
          this.datasourceQt.count = res.data.qz_questions.length;
        }
      },
      (err: any) => {
        console.error(err, "err");
      }
    )
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectionQt.selected.length;
    const numRows = this.datasourceQt.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selectionQt.clear();
      return;
    }

    this.selectionQt.select(...this.datasourceQt.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selectionQt.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  addQuestionToQuiz() {

    const selectedQuestion = this.selectionQt.selected.filter((ob: any) => {
      return !this.quizQuestionMap.has(ob.id)
    }).map((obb:any)=>{
      return { question_id: obb.id, quiz_id: this.selectedItem.id }
    });

    this.rest.addQuestionToQuiz({ data: selectedQuestion }).subscribe(
      (res: any) => {
        this.dialogRef?.close();
        this.utils.openSnackBar('Questions added to Quiz  successfully !');
        this.selectionQt.clear();
        this.getQuiz();
      },
      (err: any) => {
        console.error("Error:", err);
      }
    )
  }

  addUserToQuiz() {
    const selectedUser = this.selectionUser.selected.filter((ob: any) => {
      return !this.quizUserMap.has(ob.id)
    }).map((obb:any)=>{
      return { user_id: obb.id, quiz_id: this.selectedItem.id }
    });
    console.log(this.selectionUser.selected, selectedUser, "ET")
    this.rest.addUserToQuiz({ data: selectedUser }).subscribe(
      (res: any) => {
        this.dialogRef?.close();
        this.utils.openSnackBar('Questions added to Quiz  successfully !');
        this.selectionUser.clear();
        this.getQuiz();
      },
      (err: any) => {
        console.error("Error:", err);
      }
    )
  }


  getUser(data?: any) {
    let params: any = {
      // limit: this.paginator.limit,
      // offset:this.paginator.offset,
      pg: "false",
      search: data
    };
    // if(this.searchKey.value){
    //   params.search = this.searchKey.value;
    // }
    this.restUser.getUser(params).subscribe(
      (res: any) => {
        if (res.status) {
          this.datasourceUser.data = res?.data?.rows?.map((ob: any) => {
            ob.mobile = this.utils.decryptText(ob.mobile);
            return ob;
          });
          this.datasourceUser.count = res.data.count;
        }
      },
      (err: any) => {
        console.error(err, "err");
      }
    )
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedUser() {
    const numSelected = this.selectionUser.selected.length;
    const numRows = this.datasourceUser.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRowsUser() {
    if (this.isAllSelectedUser()) {
      this.selectionUser.clear();
      return;
    }

    this.selectionUser.select(...this.datasourceUser.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelUser(row?: any): string {
    if (!row) {
      return `${this.isAllSelectedUser() ? 'deselect' : 'select'} all`;
    }
    return `${this.selectionUser.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }



  getQuestionToQuiz(quizid: any) {
    let params: any = {
      limit: this.paginator.limit,
      offset: this.paginator.offset,
      quiz_id: quizid
    };
    if (this.searchKey.value) {
      params.search = this.searchKey.value;
    }
    this.quizQuestionMap.clear();
    this.rest.getQuestionToQuiz(params).subscribe(
      (res: any) => {
        if (res.status) {
          this.datasourceQtList.data = res.data.qz_questions;
          for (let index = 0; index < this.datasourceQtList.data.length; index++) {
            const element = this.datasourceQtList.data[index];
            this.quizQuestionMap.set(element.id,true);
          }
          this.datasourceQtList.count = res.data.qz_questions.count;
        }
      },
      (err: any) => {
        console.error(err, "err");
      }
    )
  }

  deleteQuestionToQuiz(row?: any) {
    const data = { question_id: row?.qz_quiz_question_map?.question_id, quiz_id: row?.qz_quiz_question_map?.quiz_id };
    console.log(data, "DD", row);
    this.rest.deleteQuestionToQuiz(data).subscribe(
      (res: any) => {
        console.log(res);
        // this.dialogRef?.close();
        this.utils.openSnackBar('Quiz Question deleted successfully !');
        this.getQuestionToQuiz(data?.quiz_id);
      },
      (err: any) => {
        console.error("Error:", err);
      }
    )
  }


  getUserToQuiz(quizid: any) {
    let params: any = {
      limit: this.paginator.limit,
      offset: this.paginator.offset,
      quiz_id: quizid
    };
    if (this.searchKey.value) {
      params.search = this.searchKey.value;
    }
    this.quizUserMap.clear();
    this.rest.getUserToQuiz(params).subscribe(
      (res: any) => {
        if (res.status) {
          this.datasourceUserList.data = res.data.qz_users;
          for (let index = 0; index < this.datasourceUserList.data.length; index++) {
            const element = this.datasourceUserList.data[index];
            this.quizUserMap.set(element.id,true);
          }
          this.datasourceUserList.count = res.data.qz_users.count;
        }
      },
      (err: any) => {
        console.error(err, "err");
      }
    )
  }
  deleteUserToQuiz(row?: any) {
    const data = { id: row?.qz_quiz_user_map?.id };
    console.log(data, "DD", row);
    this.rest.deleteUserToQuiz(data).subscribe(
      (res: any) => {
        console.log(res);
        // this.dialogRef?.close();
        this.utils.openSnackBar('Quiz Question deleted successfully !');
        this.getUserToQuiz(row?.qz_quiz_user_map?.quiz_id);
      },
      (err: any) => {
        console.error("Error:", err);
      }
    )
  }

  getLeaderboard(quizid: any) {
    let params: any = {
      // limit: this.paginator.limit,
      // offset:this.paginator.offset,
      quiz_id: quizid
    };
    if (this.searchKey.value) {
      params.search = this.searchKey.value;
    }
    this.rest.getLeaderboard(params).subscribe(
      (res: any) => {
        console.log(res, 'ERs');
        if (res.status) {
          this.datasourceLB.data = res.data.map((ob: any) => {
            let respObj: any = {};
            const initialValue = 0;
            const sumWithInitial = ob.qz_questions.reduce((accumulator: any, currentValue: any) => {
              const isTrue = currentValue.qz_options.some((opt: any) => {
                return opt.id == currentValue.qz_quiz_question_user_map.opt && opt.iscorrect ? true : false
              });
              return accumulator + (isTrue ? 1 : 0)
            }, initialValue);
            respObj.id = ob.qz_user.id;
            respObj.quiz_user_id = ob.id;
            respObj.user_name = ob.qz_user.user_name;
            respObj.user_dob = ob.qz_user.user_dob;
            respObj.mobile = this.utils.decryptText(ob.qz_user.mobile);
            respObj.group = ob.qz_user.group;
            respObj.email = ob.qz_user.email;
            respObj.total = sumWithInitial;
            respObj.qz_questions = ob.qz_questions;
            respObj.remarks = ob.remarks;
            respObj.updated_at = ob.updated_at;
            return respObj;
          }).sort((a:any,b:any)=>{
            return b.total - a.total
          });
          this.datasourceLB.count = res.data.count;
        }
      },
      (err: any) => {
        console.error(err, "err");
      }
    )
  }

  openResult(row: any) {
    console.log(row, "row");
    this.selectedResult = row;
    this.remarkKey.reset();
    this.remarkKey.patchValue(row.remarks);
    this.showResult = true;
  }

  exportUsers() {
    // console.log(this.datasourceLB?.data,"d")
    let data:any = [...this.datasourceLB?.data];
    data = data.map((ob:any)=>{
      delete ob.qz_questions;
      return ob;
    })
    
    console.log(data,"d")
    let csvData = this.utils.convertJsonToCSV(data);
    this.utils.downloadFile(csvData, 'leaderboard.csv')
    this.utils.openSnackBar('Exported successfully !');
  }

  submitReview(){
    
    const data = { remarks: this.remarkKey.value, id: this.selectedResult.quiz_user_id};
    console.log(data,'dremarkl');
    this.rest.startQuiz(data).subscribe(
      (res: any) => {
        // this.dialogRef?.close();
        this.utils.openSnackBar('Remark added successfully !');
        // this.selectionUser.clear();
        // this.getQuiz();
      },
      (err: any) => {
        console.error("Error:", err);
      }
    )
  }

}
