import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Employee } from '@domain/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://retoolapi.dev/HYd96h/data';
  private employees: Employee[] = [];

  constructor(private http: HttpClient) {}

  getEmployees() {
    if (this.employees.length === 0) {
      return this.http.get<Employee[]>(this.apiUrl);
    }
    return of(this.employees);
  }

}
