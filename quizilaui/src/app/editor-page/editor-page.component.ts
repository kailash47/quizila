import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import EditorJS from "@editorjs/editorjs";
declare var editorjsCodeflask:any;
declare var CodeTool:any;
@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.scss']
})
export class EditorPageComponent implements OnInit {

  @Input() holderId:any;
  @Input() data:any;
  @Output() editorChange:EventEmitter<any> =new EventEmitter<any>();
  editor!: EditorJS;
  constructor() { }

  ngOnInit(): void {
    try {
      const editordata = JSON.parse(this.data);
      editordata.blocks = editordata.blocks.map((ob:any)=>{
        if(ob.type == "code"){
          ob.data.code = ob.data.code.replace(/\\n/g, '\n')
        }
        return ob;
      });
      console.log(editordata,"SS",editordata);
      this.editor = new EditorJS({
        holderId: this.holderId,
        // placeholder: "Type your question here",
        // minHeight:300,
        hideToolbar:true,
        tools:{
          code : editorjsCodeflask
        },
        data:editordata,
        readOnly:true,
        // onChange:(api, event)=> {
        //   // console.log(api.saver.save(),"eventapi");
        //   // console.log(event,"event");
        //   // this.editorChange.emit(this.editor.saver.save());
        //   this.update();
        // },
      });
    } catch (error) {
      console.log("SS",this.data);
      this.editor = new EditorJS({
        holderId: this.holderId,
        placeholder: "Type your question here",
        // minHeight:300,
        hideToolbar:true,
        tools:{
          code : editorjsCodeflask
        },
        // data:this.data,
        readOnly:false,
        // onChange:(api, event)=> {
        //   // console.log(api.saver.save(),"eventapi");
        //   // console.log(event,"event");
        //   // this.editorChange.emit(this.editor.saver.save());
        //   this.update();
        // },
      });
    }
    
  }

  update() {
    this.editor.save().then((editorData)=>{
      this.editorChange.emit(editorData);
    })
    
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }

}
