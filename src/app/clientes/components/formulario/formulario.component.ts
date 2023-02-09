import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  title: string = 'Crear Cliente';
  editCliente: boolean = false;
  startDate = new Date(1990, 0, 1);

  reactiveForm: FormGroup = this.formBuilder.group({
    id: [''],
    nombre: ['', [Validators.required, Validators.minLength(4)]],
    apellido: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    createAt: [Date],
  });

  ngOnInit(): void {
    this.cargarCliente();
  }

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClientesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe((resp) => {
          console.log('cargarCliente', resp);
          this.editCliente = true;
          this.reactiveForm.reset({
            id: resp.id,
            nombre: resp.nombre,
            apellido: resp.apellido,
            email: resp.email,
          });
        });
      }
    });
  }

  create() {
    console.log(this.reactiveForm.value);
    this.clienteService.create(this.reactiveForm.value).subscribe((resp) => {
      console.log('resp-create', resp.cliente.nombre);

      this.router.navigate(['/clientes']),
        Swal.fire(
          'Nuevo Cliente',
          `${resp.message}: ${resp.cliente.nombre}`,
          'success'
        );
    });
  }

  update(): void {
    this.clienteService.update(this.reactiveForm.value).subscribe((resp) => {
      this.router.navigate(['/clientes']);
      Swal.fire(
        'Cliente Actualizado',
        `Cliente ${resp.cliente.nombre} actualizado con éxito`,
        'success'
      );
    });
  }

  notValid(field: string) {
    return (
      this.reactiveForm.controls[field].touched &&
      this.reactiveForm.controls[field].errors
    );
  }
}
