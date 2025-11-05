import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { TodoCardComponent } from '../todo-card/todo-card.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoCardComponent, TodoFormComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit {
  private todoService = inject(TodoService);
  private cdr = inject(ChangeDetectorRef);
  
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  loading = false;
  error: string | null = null;
  
  // Filtros
  searchTerm = '';
  filterStatus: 'all' | 'completed' | 'pending' = 'all';
  filterPriority: number | 'all' = 'all';
  sortBy: 'title' | 'priority' | 'date' = 'date';
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;
  
  // Modal
  showForm = false;
  editingTodo: Todo | null = null;

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();
    
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Error al cargar los TODOs';
        console.error(err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  reloadTodos(): void {
    // Recargar sin mostrar el loading spinner
    this.error = null;
    
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.applyFilters();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al recargar:', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.todos];
    
    // Filtrar por búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(term) || 
        todo.description.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por estado
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(todo => 
        this.filterStatus === 'completed' ? todo.isCompleted : !todo.isCompleted
      );
    }
    
    // Filtrar por prioridad
    if (this.filterPriority !== 'all') {
      filtered = filtered.filter(todo => todo.priority === this.filterPriority);
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          return b.priority - a.priority;
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    this.filteredTodos = filtered;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedTodos(): Todo[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTodos.slice(start, end);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  openCreateForm(): void {
    this.editingTodo = null;
    this.showForm = true;
  }

  openEditForm(todo: Todo): void {
    this.editingTodo = todo;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingTodo = null;
  }

  onTodoSaved(): void {
    this.closeForm();
    this.reloadTodos();
  }

  onTodoDeleted(): void {
    this.reloadTodos();
  }

  onTodoToggled(): void {
    this.reloadTodos();
  }
}
