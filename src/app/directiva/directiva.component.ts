import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css'],
})
export class DirectivaComponent {
  listadoCurso: string[] = [
    'TypeScript',
    'JavaScript',
    'Java SE',
    'C#',
    'Python',
  ];

  verCurso: boolean = true;
  constructor() {}

  ocultar() {
    this.verCurso ? (this.verCurso = false) : (this.verCurso = true);
  }
}
