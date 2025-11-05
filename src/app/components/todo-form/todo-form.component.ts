import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoCreate, TodoUpdate } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);

  @Input() todo: Todo | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  todoForm!: FormGroup;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.todoForm = this.fb.group({
      title: [this.todo?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.todo?.description || '', [Validators.required, Validators.minLength(5)]],
      priority: [this.todo?.priority || 2, [Validators.required]],
      isCompleted: [this.todo?.isCompleted || false]
    });
  }

  get isEditMode(): boolean {
    return this.todo !== null;
  }

  onSubmit(): void {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.isEditMode) {
      this.updateTodo();
    } else {
      this.createTodo();
    }
  }

  createTodo(): void {
    const todoCreate: TodoCreate = {
      title: this.todoForm.value.title,
      description: this.todoForm.value.description,
      priority: this.todoForm.value.priority,
      dueAt: null
    };

    this.todoService.createTodo(todoCreate).subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
      },
      error: (err) => {
        this.error = 'Error al crear el TODO';
        console.error(err);
        this.loading = false;
      }
    });
  }

  updateTodo(): void {
    if (!this.todo) return;

    const todoUpdate: TodoUpdate = {
      id: this.todo.id,
      title: this.todoForm.value.title,
      description: this.todoForm.value.description,
      priority: this.todoForm.value.priority,
      isCompleted: this.todoForm.value.isCompleted,
      dueAt: null
    };

    this.todoService.updateTodo(this.todo.id, todoUpdate).subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
      },
      error: (err) => {
        this.error = 'Error al actualizar el TODO';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getErrorMessage(field: string): string {
    const control = this.todoForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return '';
  }
}
