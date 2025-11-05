import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Todo, ApiResponse, TodoCreate, TodoUpdate } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = 'https://todoapitest.juansegaliz.com/Todos';

  // GET - Obtener todos los TODOs
  getTodos(): Observable<Todo[]> {
    return this.http.get<ApiResponse<Todo[]>>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // GET - Obtener un TODO por ID
  getTodoById(id: number): Observable<Todo> {
    return this.http.get<ApiResponse<Todo>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // POST - Crear un nuevo TODO
  createTodo(todo: TodoCreate): Observable<Todo> {
    return this.http.post<ApiResponse<Todo>>(this.apiUrl, todo).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // PUT - Actualizar un TODO
  updateTodo(id: number, todo: TodoUpdate): Observable<Todo> {
    return this.http.put<ApiResponse<Todo>>(`${this.apiUrl}/${id}`, todo).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // DELETE - Eliminar un TODO
  deleteTodo(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  // PATCH - Marcar como completado/no completado
  toggleComplete(id: number, isCompleted: boolean): Observable<Todo> {
    return this.http.patch<ApiResponse<Todo>>(`${this.apiUrl}/${id}`, { isCompleted }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
