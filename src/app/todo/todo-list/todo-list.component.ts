import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Item from '../todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  itemsAddSub!: Subscription;

  constructor(
    private todoService: TodoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.items = this.todoService.getItems();
    this.itemsAddSub = this.todoService.itemsAdded.subscribe((items) => {
      this.items = items;
    });
    this.todoService.fetchItems();
  }

  editItem(item: Item) {
    this.todoService.edit.next(true);
    this.todoService.itemSeleted.next(item);
  }

  deleteItem(item: Item) {
    this.todoService.deleteItem(item).subscribe({
      next: (v) => this.todoService.fetchItems(),
      error: (e) => this.toastr.error('', 'Unable to Delete Item'),
      complete: () => this.toastr.success('', 'Item Deleted'),
    });
  }

  ngOnDestroy(): void {
    this.itemsAddSub.unsubscribe();
  }
}
