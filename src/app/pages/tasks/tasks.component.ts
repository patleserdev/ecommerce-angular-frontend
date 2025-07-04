import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { TaskComponent } from '../../task/task.component';
import { CommonModule } from '@angular/common'; // ✅

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule, TaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  tasks: string[] = [
    'Faire les courses 🛒',
    'Apprendre Angular 📚',
    'Boire un café ☕',
  ];

  newTask: string = ''; // ✅ champ lié au formulaire
  taskControl = new FormControl(''); // ✅ on crée un FormControl

  addTaskFormsModule() {
    const trimmed = this.newTask.trim();
    if (trimmed) {
      this.tasks.push(trimmed);
      this.newTask = '';
    }
  }

  addTaskReactiveFormsModule() {
    const newTask = this.taskControl.value?.trim();
    if (newTask) {
      this.tasks.push(newTask);
      this.taskControl.reset(); // ✅ remet le champ à vide
    }
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }

  editingIndex: number | null = null;
  editingText: string = '';

  // startEdit(index: number) {
  //   this.editingIndex = index;
  //   this.editingText = this.tasks[index];
  // }

  // saveEdit() {
  //   if (this.editingIndex !== null) {
  //     this.tasks[this.editingIndex] = this.editingText.trim();
  //     this.editingIndex = null;
  //     this.editingText = '';
  //   }
  // }

  // cancelEdit() {
  //   this.editingIndex = null;
  //   this.editingText = '';
  // }

  onEditTask(event: { index: number; newText: string }) {
    this.tasks[event.index] = event.newText;
  }
}
