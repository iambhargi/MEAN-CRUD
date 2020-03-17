import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  genders = ["male", "female"];
  enteredName = '';
  enteredGender = "";
  enteredMobile;
  enteredEmail = "";
  user: User;
  private mode = 'create';
  private userId: string;
  form: FormGroup;

  constructor(public userService: UserService, public route: ActivatedRoute, private router: Router, private snakBar: MatSnackBar) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'name': new FormControl(null,
        [Validators.required,
        Validators.minLength(3)]),
      'gender': new FormControl(null),
      'mobile': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      'email': new FormControl(null, [Validators.required, Validators.email])
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.mode = 'edit';
        this.userId = paramMap.get('userId');
        this.userService.getUser(this.userId).subscribe(userData => {
          this.user = { id: userData._id, name: userData.name, gender: userData.gender, mobile: userData.mobile, email: userData.email };
          this.form.setValue({ name: this.user.name, gender: this.user.gender, mobile: this.user.mobile, email: this.user.email })
        });
      } else {
        this.mode = 'create';
        this.userId = '';
      }
    });
  }

  showSnakbar(){
    if(this.mode === "edit"){
      this.snakBar.open("Succesfully Updated.....!!",'',{
        duration: 3*1000
      });
    }else{
      this.snakBar.open("Succesfully Inserted.....!!",'',{
        duration: 3*1000
      });
    }

  }

  onSaveUser() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.userService.addUser(this.form.value.name, this.form.value.gender, this.form.value.mobile, this.form.value.email);
      //this.router.navigate("showuser");
    } else {
      this.userService.updateUser(this.userId, this.form.value.name, this.form.value.gender, this.form.value.mobile, this.form.value.email);
    }
    this.form.reset();
  }
}
