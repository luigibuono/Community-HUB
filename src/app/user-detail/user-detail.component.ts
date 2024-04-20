import { Component, OnInit } from '@angular/core';
import { Post, User } from '../model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from '../services/http-service.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  selectedUser: User;
  selectedPost: Post;
  userEdit: User;
  postEdit: Post;
  openPopUpDeletePost: boolean = false;
  openPopUpDelete: boolean = false;
  openPopUpEdit: boolean = false;
  openPopUpEditPost: boolean = false;

  posts: any = [];
  seePost: boolean = false;

  newPost: any = {
    title: '',
    body: '',
    userId: undefined,
  };
  response: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpServiceService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getPost();
  }

  getUser() {
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

  deleteComment() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.deleteComment(id).subscribe();
    setTimeout(() => {
      this.router.navigate(['/posts']);
    }, 1000);
  }

  clickUserEdit() {
    this.openPopUpEdit = true;
    this.userEdit = this.selectedUser;
    this.getUser();
  }

  clickPostEdit(){
    this.openPopUpEditPost = true;
    this.postEdit = this.selectedPost;
    this.getPost();
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
}
