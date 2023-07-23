import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public static BASE_URL:string = 'http://localhost:3000/api'; //'http://206.189.142.141/api';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  private static SECRET:string = 'Quizilla47';
  constructor(private _snackBar: MatSnackBar) {
    // this.localStorageSubs();
  }

  openSnackBar(message:string,action?:string) {
    this._snackBar.open(message, (action || 'Close'), {
      duration: 10000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  getHeaders() {
    const headers = new HttpHeaders({
      authorization: 'Bearer ' + localStorage.getItem('token')
    });

    return { headers }
  }

  // JSON to CSV Converter
  convertJsonToCSV(objArray:any,delimeter?:string) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let header = Object.keys(array[0]).join(delimeter || ",");
    str += header + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
        for (let index in array[i]) {
            if (line != '') line += (delimeter || ",")
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
  }

  downloadFile(data:any,filename?:string){
    const blob = new Blob([data],  {type: 'text/csv' });
    const downloadURL = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = filename || 'downlaod.csv';
    link.click();
  }

  getItem(key:string){
    return localStorage.getItem(key);
  }

  setItem(key:string,value:any){
    value = typeof value == 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(key,value);
  }

  localStorageSubs(){
    window.addEventListener('storage', function(event){
      if (event.storageArea === localStorage) {
          // It's local storage
          console.log(event,'ec');
      }
  }, false);
  }

  isUserAuthorised(): boolean  {
    const token = localStorage.getItem('token');
    const userProfile = localStorage.getItem('user');
    return !!(token && userProfile);
  }

  hashText(textToBeEncrypted: string): string {
    return CryptoJS.SHA1(textToBeEncrypted).toString();
  }

  encryptText(textToBeEncrypted: string): string {
    return CryptoJS.AES.encrypt(textToBeEncrypted, UtilsService.SECRET).toString();
  }

  decryptText(textToBeDecrypted: string): string {
    let bytes  = CryptoJS.AES.decrypt(textToBeDecrypted, UtilsService.SECRET);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText
  }

  convertCSVToJSON(csv:any,delimeter:any=","){
    try {
      let lines=csv.split("\r\n");
      let result = [];
      let headers=lines[0].split(delimeter);
      for(let i=1;i<lines.length-1;i++){
        let obj:any = {};
        let currentline=lines[i].split(delimeter);
        for(let j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      return JSON.parse(JSON.stringify(result)); //JSON
    } catch (error) {
      return error;
    }
    
  }
  
}
