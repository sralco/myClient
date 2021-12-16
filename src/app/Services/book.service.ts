import { HttpClient , HttpHeaders } from '@angular/common/Http';
import { Book } from '../Models/Book';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

const httpOption = {
    headers: new HttpHeaders({'Content-Type' : 'application/json'})
  };

@Injectable({
  providedIn: 'root'
})
export class BookService {

 private api = 'https://localhost:3000/Book/';

 constructor(private http: HttpClient) { }

 getBooks(): Observable<Book[]> {
  return this.http.get<Book[]>(this.api);
 }

 getBook(id: string): Observable<Book> {
   const url = this.api + id;
   return this.http.get<Book>(url);
 }

  addBook(b: Book): Observable<any> {
    return this.http.post(this.api, b, httpOption);
  }

  editBook(b: Book): Observable<any> {
    const url = this.api + b.id;

    return this.http.patch(url, b, httpOption);
  }

  deleteBook(b: Book): Observable<any> {
    const url = this.api + b.id;

    return this.http.delete<any>(url);
  }

}
