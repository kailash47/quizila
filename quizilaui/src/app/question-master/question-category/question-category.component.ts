import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuestionService } from 'src/app/services/question/question.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
// import { Editor } from 'ngx-editor';
import EditorJS from "@editorjs/editorjs";

@Component({
  selector: 'app-question-category',
  templateUrl: './question-category.component.html',
  styleUrls: ['./question-category.component.scss']
})
export class QuestionCategoryComponent implements OnInit {
  editor: any;
  // html:any= '';
  displayedColumns: string[] = ['name','updated_at','action'];
  datasource:any={};
  paginator:any={};
  dialogRef!: MatDialogRef<any>;
  categoryFG!: FormGroup;
  selectedItem: any;
  searchKey: FormControl;
  isUpdate: boolean = false;

  @ViewChild('fileUpload') imageUpload!: ElementRef;
  
  constructor(private rest:QuestionService,public dialog: MatDialog,private fb:FormBuilder,public utils:UtilsService) {
    this.datasource = {
      data:[],
      count:0
    };
    this.paginator = {limit:10,offset:0}
    this.searchKey = new FormControl('');
    // this.editor = new Editor();
  }

  ngOnInit(): void {
    this.getCategory();
    this.initFormGroup();

    this.searchKey.valueChanges.pipe(debounceTime(1000),distinctUntilChanged()).subscribe((data)=>{
      if(data?.length > 2){
        this.paginator = {limit:10,offset:0}
        this.getCategory();
      } else if(data?.length == 0){
        this.getCategory();
      }
    })
  }

  ngOnDestroy(): void {
    // this.editor.destroy();
  }

  initFormGroup(){
    this.categoryFG = this.fb.group({
      catname:['',[Validators.required]],
      catdesc:['']
    });
  }

  getCategory(){
    let params:any = {
      limit: this.paginator.limit,
      offset:this.paginator.offset,
    };
    if(this.searchKey.value){
      params.search = this.searchKey.value;
    }
    this.rest.getCategory(params).subscribe(
      (res:any)=>{
        if(res.status){
          this.datasource.data = res.data.rows;
          this.datasource.count = res.data.count;
        }
      },
      (err:any)=>{
        console.error(err,"err");
      }
    )
  }

  openDialog(templateRef:any,row:any,action?:any): void {
    
    this.selectedItem = row;
    this.dialogRef = this.dialog.open(templateRef, {
      width: '400px',
    });
    if(action ==='update'){
      this.isUpdate = true;
      this.categoryFG.patchValue(row);
    } else if(action ==='add'){
      this.categoryFG.reset();
      this.isUpdate = false;
    }

    // this.editor = new EditorJS( {
    //   holderId: 'editor-js',
     
    // });
  }

  addCategory(){
    if(this.categoryFG.valid){
      const data = this.categoryFG.value;
      this.rest.addCategory(data).subscribe(
        (res:any)=>{
          console.log(res);
          this.dialogRef?.close();
          this.utils.openSnackBar('Category added successfully !');
          this.getCategory();
        },
        (err:any)=>{
          console.error("Error:",err);
        }
      )
    }else{
      this.utils.openSnackBar('Please Fill Required Field','Close');
    }
    
  }

  updateCategory(){
    if(this.categoryFG.valid){
      const data = {...this.categoryFG.value, id: this.selectedItem.id};
      this.rest.updateCategory(data).subscribe(
        (res:any)=>{
          console.log(res);
          this.dialogRef?.close();
          this.isUpdate = false;
          this.utils.openSnackBar('Category updated successfully !');
          this.getCategory();
        },
        (err:any)=>{
          console.error("Error:",err);
        }
      )
    }else{
      this.utils.openSnackBar('Please Fill Required Field','Close');
    }
    
  }

  deleteCategory(){
      const data = {id:this.selectedItem.id};
      this.rest.deleteCategory(data).subscribe(
        (res:any)=>{
          console.log(res);
          this.dialogRef?.close();
          this.utils.openSnackBar('Category deleted successfully !');
          this.getCategory();
        },
        (err:any)=>{
          console.error("Error:",err);
        }
      )
  }

  onPageChange(pageEvent: PageEvent){
    this.paginator.limit = pageEvent.pageSize;
    this.paginator.offset = this.paginator.limit * pageEvent.pageIndex;
    this.getCategory();
  }
}
