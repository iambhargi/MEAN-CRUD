import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Subject, from } from 'rxjs';
import { HttpClient } from "@angular/common/http"
import { map } from "rxjs/operators";
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private usersUpdated = new Subject<User[]>();

  constructor(private http: HttpClient, private router: Router, private snakeBar: MatSnackBar) { }

  getUsers() {
    this.http.get<{ message: string, users: any }>("http://localhost:3000/api/users")
      .pipe(map((userData) => {
        return userData.users.map(post => {
          return {
            name: post.name,
            gender: post.gender,
            mobile: post.mobile,
            email: post.email,
            id: post._id
          };
        });
      }))
      .subscribe((transformedUser) => {
        this.users = transformedUser;
        this.usersUpdated.next([...this.users]);
      });
  }

  getUser(userId: string) {
    // return {...this.users.find(user => user.id === id)};
    return this.http.get<{ _id: string, name: string, gender: string, mobile: number, email: string }>("http://localhost:3000/api/users/" + userId)
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  addUser(name: string, gender: string, mobile: number, email: string) {
    const user: User = { id: '', name: name, gender: gender, mobile: mobile, email: email };
    this.http.post<{ message: string, userId: string }>("http://localhost:3000/api/users", user)
      .subscribe((responsedata) => {
        const id = responsedata.userId;
        user.id = id;
        this.users.push(user);
        this.usersUpdated.next([...this.users]);
        this.router.navigate(["showUser"]);
      })
  }

  updateUser(id: string, name: string, gender: string, mobile: number, email: string) {
    const user: User = { id: id, name: name, gender: gender, mobile: mobile, email: email };
    this.http.put("http://localhost:3000/api/users/" + id, user)
      .subscribe(response => {
        const updatedUsers = [...this.users];
        const oldUserIndex = updatedUsers.findIndex(u => u.id === user.id);
        updatedUsers[oldUserIndex] = user;
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users]);
        this.router.navigate(["showUser"]);
      });
  }

  deleteUser(userId: string) {
    const res = confirm("Are you sure you want to delete this Record?");
    if (res) {
      this.http.delete("http://localhost:3000/api/users/" + userId)
        .subscribe(() => {
          const updatedUsers = this.users.filter(user => user.id !== userId);
          this.users = updatedUsers;
          this.usersUpdated.next([...this.users]);
          this.snakeBar.open("Succesfully Deleted.....!!",'',{
            duration: 3*1000
          });
        });
    }
  }

}
