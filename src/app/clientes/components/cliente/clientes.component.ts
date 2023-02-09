import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../../interfaces/cliente.interface';
import {
  ClientePageable,
  Content,
} from '../../interfaces/clientePage.interface';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clientes: Content[] = [];
  paginador!: ClientePageable;

  constructor(
    private clienteService: ClientesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  //por el observable del servicio, es que podemos usar el subscribe
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let page = Number(params.get('page'));

      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe((resp) => {
        this.clientes = resp.content;
        this.paginador = resp;
      });
    });
  }

  eliminar(cliente: Content): void {
    console.log(cliente);
    Swal.fire({
      title: '¿ Estás Seguro ?',
      text: `¿Eliminar al cliente ${cliente.nombre} ${cliente.apellido} ?`,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#cc3300',
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe((resp) => {
          console.log(cliente);
          this.clientes = this.clientes.filter((cli) => cli !== cliente);
        });
        Swal.fire(
          'Eliminado !',
          `El cliente ${cliente.nombre} ${cliente.apellido} fue eliminado`,
          'success'
        );
      }
    });
  }
}
