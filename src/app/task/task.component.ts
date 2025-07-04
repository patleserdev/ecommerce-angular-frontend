import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  imports: [CommonModule],
})
export class TaskComponent {
  // task = 'Faire les courses 🛒';
  @Input() task: string = ''; // 👈 on attend une tâche passée depuis le parent
  @Input() index!: number;
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<{ index: number; newText: string }>();

  isEditing = false;
  editableTaskText = '';

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.editableTaskText = input.value;
  }

  startEditing() {
    this.isEditing = true;
    this.editableTaskText = this.task; // préremplir input avec texte courant
  }

  cancelEditing() {
    this.isEditing = false;
  }

  saveEditing() {
    if (this.editableTaskText.trim() !== '') {
      this.edit.emit({
        index: this.index,
        newText: this.editableTaskText.trim(),
      });
      this.isEditing = false;
    }
  }

  deleteTask() {
    this.delete.emit(this.index);
  }
}
