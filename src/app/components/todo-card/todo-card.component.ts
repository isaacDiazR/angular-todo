import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.scss'
})
export class TodoCardComponent {
  private todoService = inject(TodoService);

  @Input() todo!: Todo;
  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<void>();

  showDeleteConfirm = false;
  loading = false;

  get priorityLabel(): string {
    switch (this.todo.priority) {
      case 1: return 'BAJA';
      case 2: return 'MEDIA';
      case 3: return 'ALTA';
      default: return 'MEDIA';
    }
  }

  get priorityClass(): string {
    switch (this.todo.priority) {
      case 1: return 'low';
      case 2: return 'medium';
      case 3: return 'high';
      default: return 'medium';
    }
  }

  onToggleComplete(): void {
    this.loading = true;
    this.todoService.toggleComplete(this.todo.id, !this.todo.isCompleted).subscribe({
      next: () => {
        this.loading = false;
        this.toggle.emit();
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        this.loading = false;
      }
    });
  }

  onEdit(): void {
    this.edit.emit(this.todo);
  }

  onDeleteClick(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  confirmDelete(): void {
    this.loading = true;
    this.todoService.deleteTodo(this.todo.id).subscribe({
      next: () => {
        this.loading = false;
        this.showDeleteConfirm = false;
        this.delete.emit();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.loading = false;
        this.showDeleteConfirm = false;
      }
    });
  }
}
