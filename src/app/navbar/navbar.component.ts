import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../model';
import { MatPaginator } from '@angular/material/paginator';
import { HttpServiceService } from '../services/http-service.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private http: HttpServiceService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  users: any = [];
  newUser?: User;
  searchString!: string;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  pageTotal!: string;
  pageSize: string = '10';
  isFetching: boolean = true;


  selectedUser!: User;
  userEdit!: User;
  openPopUpDelete: boolean = false;
  openPopUpEdit: boolean = false;

  posts: any = [];
  seePost: boolean = false;

  newPost: any = {
    title: '',
    body: '',
    userId: undefined,
  };
  response!: string;

  genderList = ['Male', 'Female'];
  userForm!: FormGroup;

  
  newUserCreate: User = {
    name: '',
    email: '',
    gender: '',
    status: 'active',
    id: 0
  };
  respose!: string;

  ngOnInit(): void {
    this.getUserDetails();
    this.getPost();
    this.getUser('1', '10', '');
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => {
          this.getUser(
            `${this.paginator.pageIndex + 1}`,
            `${this.paginator.pageSize}`,
            this.searchString
          );
        })
      )
      .subscribe();
  }

  getUser(pageN: string, forPage: string, searchString: string) {
    let type =
      searchString.includes('@') || searchString.includes('_')
        ? 'email'
        : 'name';
    this.searchString = searchString;
    this.http
      .printUsers(pageN, forPage, searchString, type)
      .subscribe((response) => {
        this.users = response.body;
        this.pageTotal = String(response.headers.get('X-Pagination-Total'));
        this.isFetching = false;
      });
  }

  getUserDetails() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.getUserById(id).subscribe((data: any) => {
      this.selectedUser = data.body;
    });
  }
  getPost() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.getUserPost(id).subscribe((response) => {
      this.posts = response.body;
    });
  }

  deleteUser() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.deleteUser(id).subscribe();
    setTimeout(() => {
      this.router.navigate(['/users']);
    }, 1000);
  }

  clickUserEdit() {
    this.openPopUpEdit = true;
    this.userEdit = this.selectedUser;
    this.getUserDetails();
  }

  goBack() {
    console.log(this.userEdit);
    this.openPopUpEdit = false;
  }

  editUser() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http
      .updateUser(id, this.userEdit)
      .subscribe((data) => console.log(data.body));
    setTimeout(() => {
      this.router.navigate(['/users']);
    }, 1000);
  }

  createNewPost() {

  let user = JSON.parse(`${localStorage.getItem('currentUser')}`);
  this.newPost.userId = user.id;
  this.http.createNewPost(this.newPost, user.id).subscribe((data) => {
    if (data.status == 201) {
      this.response = 'New post has been created';
      setTimeout(() => {
        this.router.navigate(['/posts']);
      }, 1500);
    }
  });
  }


  createNewUser() {
    this.http.addUser(this.newUserCreate).subscribe((data) => {
      if (data.status == 201) {
        this.respose = 'New user has been created';
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 1500);
      }
    });
  }


  logout(){
    localStorage.clear();
    this.router.navigate(['/login'])
  }
  
}

