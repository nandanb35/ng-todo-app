import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { TodoService } from '../todo.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css'],
})
export class TodoFormComponent implements OnInit, OnDestroy {
  // @ViewChild('form', { static: true })
  // form!: NgForm;

  form!: FormGroup;
  edit = false;
  editSubscription!: Subscription;
  itemNameSubscription!: Subscription;
  indexSubscription!: Subscription;
  id: string;

  constructor(
    private todoService: TodoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/\S/),
      ]),
    });
    this.editSubscription = this.todoService.edit.subscribe(
      (edit) => (this.edit = edit)
    );
    this.itemNameSubscription = this.todoService.itemSeleted
      .pipe()
      .subscribe((item) => {
        this.form.setValue({ name: item.name });
        this.id = item.id;
      });
  }

  onSubmit() {
    const { name } = this.form.value;

    if (this.edit) {
      this.todoService.editItem({ id: this.id, name }).subscribe({
        next: (v) => {
          this.todoService.fetchItems();
        },
        error: (e) => this.toastr.error('', 'Unable Update Item'),
        complete: () => {
          this.toastr.success('', 'Item Updated');
        },
      });
      this.todoService.edit.next(false);
      this.toastr.success('', 'Item Updated');
    } else {
      if (!name.trim()) {
        this.form.reset();
        return;
      }

      this.todoService.addItem({ id: uuidv4(), name }).subscribe({
        next: (v) => {
          this.todoService.fetchItems();
        },
        error: (e) => this.toastr.error('', 'Unable Item Added'),
        complete: () => {
          this.toastr.success('', 'Item Added');
        },
      });
    }
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
    this.itemNameSubscription.unsubscribe();
  }
}
