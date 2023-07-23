import { Component, HostListener, OnInit } from '@angular/core';
import { QuizService } from '../services/quiz/quiz.service';
import { UtilsService } from '../services/utils/utils.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-play',
  templateUrl: './quiz-play.component.html',
  styleUrls: ['./quiz-play.component.scss']
})
export class QuizPlayComponent implements OnInit {
  questions: any = [];
  currentQuestion: any;
  myActiveQuiz: any = [];
  seletedItem: any;
  isQuizStart: boolean = false;
  questionIndex: number = 0;
  noOfQuestion: number = 0;
  minutes: any;
  seconds: any;
  questionAnwerMap = new Map();
  dialogRef!: MatDialogRef<any>;
  quizInterval: any;
  user:any;
  constructor(private rest: QuizService, public utils: UtilsService,public dialog: MatDialog,private router:Router) { }

  ngOnInit(): void {
    this.getQuiz();
    this.user = JSON.parse(localStorage.getItem("user") || "{user_name:'Guest'}");
    console.log(this.user,"sd");
  }

  ngOnDestroy(){
    console.log("DESS");
    clearInterval(this.quizInterval);
  }

  nextQuestion(index: number) {
    this.questionIndex = index + 1;
    this.currentQuestion = this.questions[this.questionIndex];
  }

  previousQuestion(index: number) {
    this.questionIndex = index - 1;
    this.currentQuestion = this.questions[this.questionIndex];
  }

  getQuiz() {
    this.rest.getMyQuiz().subscribe(
      (res: any) => {
        if (res.status) {
          this.myActiveQuiz = res.data;
        }
      },
      (err: any) => {
        console.error(err, "err");
      }
    )
  }

  startQuiz(quiz: any) {
    this.isQuizStart = true;
    this.seletedItem = quiz;
    this.questions = this.shuffle(quiz?.qz_quiz?.qz_questions);
    this.noOfQuestion = this.questions.length;
    this.currentQuestion = this.questions[this.questionIndex];
    this.startTimer(Number(quiz?.qz_quiz?.quiztime)*60);
    this.questionAnwerMap.clear();
    const data = { status:'INPROGRESS' ,starttime: new Date(), id:this.seletedItem.id}
    this.rest.startQuiz(data).subscribe(
      (res: any) => {
        if (res.status) {
          console.log(res);
          this.utils.openSnackBar("ayyye abhi ayega na maja , Good Luck 😎 🤞");
        }
      },
      (err: any) => {
        console.error(err, "err");
      }
    )
  }

  // getTimeInSeconds(timeInstring:any){
  //   const time
  // }

  submitQuiz() {
    const answers = [...this.questionAnwerMap.values()];
    const data = {data:answers,quiz_user_id:this.seletedItem.id}
    console.log(answers,'answers');
    
    this.rest.submitQuiz(data).subscribe(
      (res: any) => {
        if (res.status) {
          console.log(res);
          // this.dialogRef?.close();
          this.utils.openSnackBar("Bhai apka knowledge toh kamal ka hai 😎");
          localStorage.clear();
          this.router.navigate(['thank-you'])
        }
      },
      (err: any) => {
        console.error(err, "err");
        if(err?.error?.data == "Validation error"){
          this.utils.openSnackBar("Already Submiited !");
          localStorage.clear();
          this.router.navigate(['thank-you'])
        }else{
          this.utils.openSnackBar("Failed to submit ");
        }
      }
    )
    
  }

  startTimer(duration: any) {
    let timer: any = duration;
    let minutes: any;
    let seconds: any;
    this.quizInterval = setInterval(() => {
      minutes = parseInt((timer / 60).toString(), 10)
      seconds = parseInt((timer % 60).toString(), 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      this.minutes = minutes;
      this.seconds = seconds;
      if(timer == 20){
        this.utils.openSnackBar("Arre jaldi kar panvel nikalna hai... 📢");
      }
      if(timer == 5){
        this.utils.openSnackBar("Tick, Tick Booom! 💣 💥");
      }
      if(timer == 50){
        this.utils.openSnackBar("Main Samay Hu ⏰ , samay samay par leta rahunga 👽");
      }

      if (--timer < 0) {
        // timer = duration;
        // alert("Your Time Over");
        this.utils.openSnackBar("Beta tumse na ho payi ");
        clearInterval(this.quizInterval);
        this.submitQuiz();
      }
    }, 1000);
  }

  optionSelected(opt: any) {
    this.currentQuestion.selectedOpt = opt.id;
    const answer = {
      question_id:this.currentQuestion.id,
      quiz_user_id: this.seletedItem.id,
      opt:opt.id
    };
    this.questionAnwerMap.set(answer.question_id,answer);
    console.log(opt, "OP");
  }

  openDialog(templateRef:any): void {
    let width = '400px';
    this.dialogRef = this.dialog.open(templateRef, {
      width: width,
    });
  }

  shuffle(array:any) {
    let currentIndex = array.length;
    let randomIndex:any;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['/'])
  }
}
