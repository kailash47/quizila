import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QuestionService } from 'src/app/services/question/question.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
// import EditorJS from "@editorjs/editorjs";
// import * as CodeTool from '@editorjs/code';
// import * as editorjsCodeflask from '@calumk/editorjs-codeflask';
// declare var CodeTool:any;
declare var editorjsCodeflask:any;

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {
  editor: any;
  displayedColumns: string[] = ['name','updated_at','action'];
  datasource:any={};
  paginator:any={};

  displayedColumnsOpt: string[] = ['name',"iscorrect",'updated_at','action'];
  datasourceOpt:any={};
  paginatorOpt:any={};


  dialogRef!: MatDialogRef<any>;
  questionFG!: FormGroup;
  selectedItem: any;
  searchKey: FormControl;
  isUpdate: boolean = false;

  @ViewChild('fileUpload') imageUpload!: ElementRef;
  catList: any;
  optionFG!: FormGroup;
  isUpdateOpt: boolean = false;
  
  constructor(private rest:QuestionService,public dialog: MatDialog,private fb:FormBuilder,public utils:UtilsService) {
    this.datasource = {
      data:[],
      count:0
    };
    this.paginator = {limit:10,offset:0}

    this.datasourceOpt = {
      data:[],
      count:0
    };
    this.paginatorOpt = {limit:10,offset:0}
    this.searchKey = new FormControl('');
  }

  ngOnInit(): void {
    this.getQuestion();
    this.initFormGroup();
    this.getCatList();
    this.searchKey.valueChanges.pipe(debounceTime(1000),distinctUntilChanged()).subscribe((data)=>{
      if(data?.length > 2){
        this.paginator = {limit:10,offset:0}
        this.getQuestion();
      } else if(data?.length == 0){
        this.getQuestion();
      }
    })
  }

  ngOnDestroy(){
    console.log("DESS");
  }

  initFormGroup(){
    this.questionFG = this.fb.group({
      question:[''],
      qtype:['',[Validators.required]],
      answer:[''],
      cats:['',[Validators.required]]
    });

    this.optionFG = this.fb.group({
      question_id:['',[Validators.required]],
      option:['',[Validators.required]],
      iscorrect:['',[Validators.required]],
      desc:['']
    });
  }

  getQuestion(){
    let params:any = {
      limit: this.paginator.limit,
      offset:this.paginator.offset,
    };
    if(this.searchKey.value){
      params.search = this.searchKey.value;
    }
    this.rest.getQuestion(params).subscribe(
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
    let width = '400px'
    if(action ==='update'){
      width = "600px"
      this.isUpdate = true;
      let cats = row.qz_qcategories.map((ob:any)=>{ return ob.id})
      this.questionFG.patchValue(row);
      this.questionFG.get('cats')?.patchValue(cats);
    } else if(action ==='add'){
      width = '600px'
      this.questionFG.reset();
      this.isUpdate = false;
    }else if(action ==='optadd'){
      this.isUpdateOpt = false;
      this.optionFG.reset();
      this.optionFG.get('question_id')?.setValue(this.selectedItem.id);
    }else if(action ==='optview'){
      this.optionFG.reset();
      this.getOption();
      width = "600px"
    }
    else if(action ==='optupd'){
      this.isUpdateOpt = true;
      row.iscorrect =  row.iscorrect ? "true":"false"
      this.optionFG.patchValue(row);
      // this.optionFG.reset();
    }
    this.dialogRef = this.dialog.open(templateRef, {
      width: width,
    });
  }

  getCatList(){
    let params:any = {
      pg: 'false'
    };
    this.rest.getCategory(params).subscribe(
      (res)=>{
        if(res.status){
          this.catList = res.data.rows;
        }
      },
      (err)=>{
        console.error(err,"err");
      }
    )
  }

  addQuestion() {
    if (this.questionFG.valid) {
      const data = this.questionFG.value;

      // this.editor.save().then((editorData:any)=>{

      //   // console.log(editorData,'editorData');
      //   data.question = JSON.stringify(editorData);
      //   console.log(data,'data');
      this.rest.addQuestion(data).subscribe(
        (res: any) => {
          console.log(res);
          this.dialogRef?.close();
          this.utils.openSnackBar('Question added successfully !');
          this.getQuestion();
        },
        (err: any) => {
          console.error("Error:", err);
        }
      )
      // }).catch((error:any)=>{
      //   console.log(error,"error");
      // });


    } else {
      this.utils.openSnackBar('Please Fill Required Field', 'Close');
    }

  }

  updateQuestion(){
    if(this.questionFG.valid){
      const data = {...this.questionFG.value, id: this.selectedItem.id};
      this.rest.updateQuestion(data).subscribe(
        (res:any)=>{
          console.log(res);
          this.dialogRef?.close();
          this.isUpdate = false;
          this.utils.openSnackBar('Question updated successfully !');
          this.getQuestion();
        },
        (err:any)=>{
          console.error("Error:",err);
        }
      )
    }else{
      this.utils.openSnackBar('Please Fill Required Field','Close');
    }
    
  }

  deleteQuestion(){
      const data = {id:this.selectedItem.id};
      this.rest.deleteQuestion(data).subscribe(
        (res:any)=>{
          console.log(res);
          this.dialogRef?.close();
          this.utils.openSnackBar('Question deleted successfully !');
          this.getQuestion();
        },
        (err:any)=>{
          console.error("Error:",err);
        }
      )
  }

  onPageChange(pageEvent: PageEvent){
    this.paginator.limit = pageEvent.pageSize;
    this.paginator.offset = this.paginator.limit * pageEvent.pageIndex;
    this.getQuestion();
  }


  getOption(id?:any){
    let params:any = {
      limit: this.paginatorOpt.limit,
      offset:this.paginatorOpt.offset,
    };
    if(this.searchKey.value){
      params.search = this.searchKey.value;
    }

    if(this.selectedItem.id || id){
      params.search = id || this.selectedItem.id;
    }
    this.rest.getOption(params).subscribe(
      (res:any)=>{
        if(res.status){
          this.datasourceOpt.data = res.data.rows;
          this.datasourceOpt.count = res.data.count;
        }
      },
      (err:any)=>{
        console.error(err,"err");
      }
    )
  }

  addOption(){
    if(this.optionFG.valid){
      const data = this.optionFG.value;
      console.log(data,'S');
      this.rest.addOption(data).subscribe(
        (res:any)=>{
          console.log(res);
          this.dialogRef?.close();
          this.utils.openSnackBar('Option added successfully !');
          // this.getQuestion();
        },
        (err:any)=>{
          console.error("Error:",err);
        }
      )
    }else{
      this.utils.openSnackBar('Please Fill Required Field','Close');
    }
    
  }

  updateOption(){
    if(this.optionFG.valid){
      const data:any = {...this.optionFG.value, id: this.selectedItem.id};
      this.rest.updateOption(data).subscribe(
        (res:any)=>{
          console.log(res);
          this.dialogRef?.close();
          this.isUpdateOpt = false;
          this.utils.openSnackBar('Option updated successfully !');
          this.getOption(data?.question_id);
        },
        (err:any)=>{
          console.error("Error:",err);
        }
      )
    }else{
      this.utils.openSnackBar('Please Fill Required Field','Close');
    }
    
  }

  deleteOption(){
      const data = {id:this.selectedItem.id};
      this.rest.deleteOption(data).subscribe(
        (res:any)=>{
          console.log(res);
          this.dialogRef?.close();
          this.utils.openSnackBar('Option deleted successfully !');
          this.getOption(this.selectedItem.question_id);
        },
        (err:any)=>{
          console.error("Error:",err);
        }
      )
  }

  onPageChangeOpt(pageEvent: PageEvent){
    this.paginatorOpt.limit = pageEvent.pageSize;
    this.paginatorOpt.offset = this.paginatorOpt.limit * pageEvent.pageIndex;
    this.getOption();
  }

  update(dd:any){
    console.log(dd,"DD");
  }


}
