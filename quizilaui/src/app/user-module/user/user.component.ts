import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
// import { Validators } from 'ngx-editor';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuestionService } from 'src/app/services/question/question.service';
import { UsersService } from 'src/app/services/users/users.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  editor: any;
  // html:any= '';
  displayedColumns: string[] = ['name', 'mobile', 'email', 'dob', 'group', 'updated_at', 'action'];
  datasource: any = {};
  paginator: any = {};
  dialogRef!: MatDialogRef<any>;
  userFG!: FormGroup;
  selectedItem: any;
  searchKey: FormControl;
  isUpdate: boolean = false;

  @ViewChild('fileUpload') imageUpload!: ElementRef;

  constructor(private rest: UsersService, public dialog: MatDialog, private fb: FormBuilder, public utils: UtilsService) {
    this.datasource = {
      data: [],
      count: 0
    };
    this.paginator = { limit: 10, offset: 0 }
    this.searchKey = new FormControl('');
    // this.editor = new Editor();
  }

  ngOnInit(): void {
    this.getUser();
    this.initFormGroup();

    this.searchKey.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((data) => {
      if (data?.length > 2) {
        this.paginator = { limit: 10, offset: 0 }
        this.getUser();
      } else if (data?.length == 0) {
        this.getUser();
      }
    })
  }

  ngOnDestroy(): void {
    // this.editor.destroy();
  }

  initFormGroup() {
    this.userFG = this.fb.group({
      user_name: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]],
      user_type: ['user', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$')]],
      email: ['', [Validators.required, Validators.email]],
      user_dob: ['', [Validators.required]],
      user_pan: ['', [Validators.pattern('^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$')]],
      role: ['user', [Validators.required]],
      secret: [''],
      status: ['true', [Validators.required]],
      group: ['']
    });
  }

  getUser() {
    let params: any = {
      limit: this.paginator.limit,
      offset: this.paginator.offset,
    };
    if (this.searchKey.value) {
      params.search = this.searchKey.value;
    }
    this.rest.getUser(params).subscribe(
      (res: any) => {
        if (res.status) {
          this.datasource.data = res?.data?.rows?.map((ob: any) => {
            ob.mobile = this.utils.decryptText(ob.mobile);
            return ob;
          });
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
    this.dialogRef = this.dialog.open(templateRef, {
      width: '400px',
    });
    if (action === 'update') {
      this.isUpdate = true;
      row.secret = ""
      this.userFG.patchValue(row);
      if (row.mobile) {
        let mobile = this.utils.decryptText(row.mobile);
        this.userFG.get('mobile')?.patchValue(mobile);
      }
      if (row.user_pan) {
        let user_pan = this.utils.decryptText(row.user_pan);
        this.userFG.get('user_pan')?.patchValue(user_pan);
      }
      this.userFG.get('status')?.patchValue(row.status.toString());

    } else if (action === 'add') {
      this.initFormGroup();
      this.isUpdate = false;
    }
  }

  addUser() {
    if (this.userFG.valid) {
      const data = this.userFG.value;

      if (data.secret) {
        data.secret = this.utils.hashText(data.secret);
      } else {
        const first3 = data?.user_name?.substring(0, 3)?.toLowerCase();
        const birthYear = data?.user_dob?.split("-")[0];
        const mySecret = first3 + birthYear;
        data.secret = this.utils.hashText(mySecret);
      }
      if (data.mobile) {
        data.mobile = this.utils.encryptText(data.mobile);
      }
      if (data.user_pan) {
        data.user_pan = this.utils.encryptText(data.user_pan);
      }
      console.log(data, "data");
      this.rest.addUser(data).subscribe(
        (res: any) => {
          console.log(res);
          this.dialogRef?.close();
          this.utils.openSnackBar('User added successfully !');
          this.getUser();
        },
        (err: any) => {
          console.error("Error:", err);
        }
      )
    } else {
      this.utils.openSnackBar('Please Fill Required Field', 'Close');
    }

  }

  updateUser() {
    if (this.userFG.valid) {
      const data = { ...this.userFG.value, id: this.selectedItem.id };
      if (data.secret) {
        data.secret = this.utils.hashText(data.secret);
      } else {
        const first3 = data?.user_name?.substring(0, 3)?.toLowerCase();
        const birthYear = data?.user_dob?.split("-")[0];
        const mySecret = first3 + birthYear;
        data.secret = this.utils.hashText(mySecret);
      }
      if (data.mobile) {
        data.mobile = this.utils.encryptText(data.mobile);
      }
      if (data.user_pan) {
        data.user_pan = this.utils.encryptText(data.user_pan);
      }
      console.log(data, "data");

      this.rest.updateUser(data).subscribe(
        (res: any) => {
          console.log(res);
          this.dialogRef?.close();
          this.isUpdate = false;
          this.utils.openSnackBar('User updated successfully !');
          this.getUser();
        },
        (err: any) => {
          console.error("Error:", err);
        }
      )
    } else {
      this.utils.openSnackBar('Please Fill Required Field', 'Close');
    }

  }

  deleteUser() {
    const data = { id: this.selectedItem.id };
    this.rest.deleteUser(data).subscribe(
      (res: any) => {
        console.log(res);
        this.dialogRef?.close();
        this.utils.openSnackBar('User deleted successfully !');
        this.getUser();
      },
      (err: any) => {
        console.error("Error:", err);
      }
    )
  }

  onPageChange(pageEvent: PageEvent) {
    this.paginator.limit = pageEvent.pageSize;
    this.paginator.offset = this.paginator.limit * pageEvent.pageIndex;
    this.getUser();
  }

  downloadSampleUserCSV() {
    this.rest.downloadSampleUserCSV().subscribe(
      (res: any) => {
        console.log(res);
        let csvData = this.utils.convertJsonToCSV(res, ",");
        this.utils.downloadFile(csvData, 'user.csv')
        this.utils.openSnackBar('Download successfully !');
      },
      (err) => {
        console.error("Error:", err);
      }
    )
  }

  exportUsers() {
    let csvData = this.utils.convertJsonToCSV(this.datasource.data);
    this.utils.downloadFile(csvData, 'user.csv')
    this.utils.openSnackBar('Exported successfully !');
  }

  openFileChooser() {
    const el: HTMLElement = this.imageUpload.nativeElement as HTMLElement;
    el.click();
  }

  uploadFile(event: any) {
    if (this.checkFile(event)) {
      const file = event.target.files[0];
      let fileReader = new FileReader();
      fileReader.onload = () => {
        console.log(fileReader.result);
      }
      fileReader.onerror = () => {
        this.utils.openSnackBar("Error while reading file");
      }
      fileReader.onloadend = () => {
        const json = this.utils.convertCSVToJSON(fileReader.result);
        this.validateFileData(json);
      }
      fileReader.readAsText(file);
    }



  }

  validateFileData(data: any) {
    if (data) {
      let validatedUser = data.filter((ob: any) => {
        this.initFormGroup();
        this.userFG.patchValue(ob);
        console.log(this.userFG);
        return this.userFG.valid
      }).map((obj: any) => {
        this.initFormGroup();
        this.userFG.patchValue(obj);
        const data:any = {...this.userFG.value};
        if (data?.user_dob) {
          data.user_dob = data?.user_dob.split("-").reverse().join('-')
        }
        if (data?.secret) {
          data.secret = this.utils.hashText(data.secret);
        } else {
          const first3 = data?.user_name?.substring(0, 3)?.toLowerCase();
          const birthYear = data?.user_dob?.split("-")[0];
          const mySecret = first3 + birthYear;
          data.secret = this.utils.hashText(mySecret);
        }
        if (data?.mobile) {
          data.mobile = this.utils.encryptText(data.mobile);
        }
        if (data?.user_pan) {
          data.user_pan = this.utils.encryptText(data.user_pan);
        }
        return data;
      });
      if(validatedUser?.length){
        const req = {data: validatedUser}
        this.rest.addUserBulk(req).subscribe(
          (res: any) => {
            console.log(res);
            this.dialogRef?.close();
            this.utils.openSnackBar('User added successfully !');
            this.getUser();
          },
          (err: any) => {
            if(err?.error?.data == "Validation error"){
              this.utils.openSnackBar("Invalid Data or Validation Error");
            }else{
              this.utils.openSnackBar("Error while uploading file");
            }
            
          }
        )
      }
      console.log(validatedUser);
    } else {
      this.utils.openSnackBar("No data for validation");
    }

  }

  checkFile(event: Event | any): boolean {
    const file = event.target.files[0];
    const filetype = file.type;
    console.log(filetype, "DD");
    // const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.bmp|\.csv|\.tsv)$/i;
    const allowedExtensions = /(\.csv)$/i;
    if (!allowedExtensions.exec(file.name)) {
      this.utils.openSnackBar('Please upload file having extensions .csv');
      return false;
    } else if (file['size'] / (1024 * 200) >= 1) {
      this.utils.openSnackBar('Maximum Allowed File size is 200KB.');
      // template.nativeElement.value = "";
      return false;
    }
    return true;
  }

}
