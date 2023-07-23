import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  loader:boolean = false;

  constructor(private fb: FormBuilder,private rest:AuthService,private utils: UtilsService,private router:Router) { }

  ngOnInit(): void {
    this.initFormGroup();
  }

  initFormGroup(){
    this.formGroup = this.fb.group({
      mobile:[''],
      email:['',[Validators.required]],
      code:['']
    });
  }

  singIn(){
    if(this.formGroup.valid){
      const data = this.formGroup.value;
      this.rest.signIn(data).subscribe(
        (res)=>{
          const {otp} = res.data;
          this.verifyOTP(otp);
        },
        (err)=>{
          console.error(err,"ERROR");
        }
      )
    }
  }

  verifyOTP(otp?:any){
    if(this.formGroup.valid){
      const data = {
        mobile:this.formGroup.get('mobile')?.value,
        otp:otp
      };
      this.rest.verifyOTP(data).subscribe(
        (res)=>{
          const {token,user} = res.data;
          this.utils.setItem('token',token);
          this.utils.setItem('user',user);
          if(user.user_type =='user'){
            this.router.navigate(['quiz-play'])
          }else{
            this.router.navigate(['app/dashboard'])
          }
          
          this.utils.openSnackBar("OTP Verified !");
        },
        (err)=>{
          console.error(err,"ERROR");
        }
      )
    }
  }

  login(){
    if(this.formGroup.valid){
      this.loader = true;
      const data = this.formGroup.value;
      const reqData = {
        email:data.email,
        code:this.utils.hashText(data.code)
      };
      this.rest.login(reqData).subscribe(
        (res)=>{
          const {token,user} = res.data;
          this.utils.setItem('token',token);
          this.utils.setItem('user',user);
          if(user.user_type =='user'){
            this.router.navigate(['quiz-play'])
          }else{
            this.router.navigate(['app/dashboard'])
          }
          
          this.utils.openSnackBar("User Verified !");
        },
        (err)=>{
          this.loader = false;
          if(err.status ===400){
            this.utils.openSnackBar(err.error.data);
          }if(err.status ===429){
            this.utils.openSnackBar("Too many request created from this IP, please try again after an hour");
          }else{
            console.error(err,"ERROR");
          }
          
        }
      )
    }
  }
}
