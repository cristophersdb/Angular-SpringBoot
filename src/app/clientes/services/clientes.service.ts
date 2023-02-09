import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
//import { Clientes } from '../components/cliente/clientes.json';
import { Cliente, RespCliente } from '../interfaces/cliente.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ClientePageable } from '../interfaces/clientePage.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  //URL
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  /* Metodo antes de usar la paginación desde spring boot */
  /*
      getClientes(): Observable<Cliente[]> {
    return this.http.get(this.urlEndPoint).pipe(
      tap((resp) => console.log(resp)),
      map((response) => response as Cliente[])
    );
  }
  */

  //Asi lo hacemos asincrono con Observable, y para que retorne string usamos of

  //metodo para obtener todos los clientes
  getClientes(page: number): Observable<ClientePageable> {
    return this.http.get(`${this.urlEndPoint}/page/${page}`).pipe(
      tap((resp) => console.log(resp)),
      map((response) => response as ClientePageable)
    );
  }

  //Metodo para crear un cliente
  create(cliente: Cliente): Observable<RespCliente> {
    return this.http
      .post<RespCliente>(this.urlEndPoint, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((err) => {
          const { error } = err;
          const { errors } = error;

          console.log('el error', errors[0]);
          Swal.fire('Error al crear el cliente', errors[0], 'error');
          return throwError(() => new Error(err));
        })
      );
  }

  //metodo para obtener un cliente por id
  getCliente(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((err) => {
        this.router.navigate(['/clientes']);
        console.error(err.error.message);
        Swal.fire('Error al editar', err.error.message, 'error');
        return throwError(() => new Error(err));
      })
    );
  }

  //metodo para actualizar un cliente
  update(cliente: Cliente): Observable<RespCliente> {
    return this.http
      .put<RespCliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((err) => {
          console.error(err.error.message);
          Swal.fire(
            'Error al actualizar el cliente',
            err.error.message,
            'error'
          );
          return throwError(() => new Error(err));
        })
      );
  }

  //metodo para eliminar un cliente
  delete(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndPoint}/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((err) => {
          console.error(err.error.message);
          Swal.fire('Error al eliminar el cliente', err.error.message, 'error');
          return throwError(() => new Error(err));
        })
      );
  }
}
