import { Injectable } from '@angular/core';
import { Subject, map, take, tap } from 'rxjs';
import Item from './todo.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  items: Item[] = [];
  itemsAdded = new Subject<Item[]>();
  edit = new Subject<boolean>();
  itemSeleted = new Subject<Item>();

  constructor(private http: HttpClient) {}

  fetchItems() {
    this.http.get<Item[]>('http://localhost:3000/items').subscribe({
      next: (v) => {
        this.setItems(v);
      },
      complete: () => {},
      error: () => {},
    });
  }

  getItems() {
    return this.items.slice();
  }

  setItems(items: Item[]) {
    this.items = items;
    this.itemsAdded.next(this.items.slice());
  }

  addItem(item: Item) {
    return this.http.post('http://localhost:3000/items', { ...item }).pipe(
      map((v) => {
        return { ...v, test: 123 };
      })
    );
  }

  deleteItem(item: Item) {
    return this.http.delete(`http://localhost:3000/items/${item.id}`);
  }

  editItem(item: Item) {
    return this.http.put(`http://localhost:3000/items/${item.id}`, { ...item });
  }
}
