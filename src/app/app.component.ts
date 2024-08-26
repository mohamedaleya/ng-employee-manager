import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from '@domain/employee.model';
import { EmployeeService } from '@service/employee.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ConfirmationService, MessageService, EmployeeService],
})
export class AppComponent implements OnInit {
  title = 'employee-manager';

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  employees: Employee[];
  employee: Employee;
  selectedEmployees: Employee[];
  submitted: boolean;
  employeeDialog: boolean;

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  openNew() {
    this.employee = {};
    this.submitted = false;
    this.employeeDialog = true;
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(
      (data) => {
        this.employees = data;
      },
      (error) => {
        console.error('Error loading employees', error);
      }
    );
  }

  hideDialog() {
    this.employeeDialog = false;
    this.submitted = false;
  }

  calculateAge(): void {
    if (this.employee.dob) {
      const dob = new Date(this.employee.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      this.employee.age = age;
    }
  }

  onFileSelected(event: any) {
    const file = event.files[0];
    if (file) {
      this.employee.imageUrl = file.name;
      console.log(file);
    } else {
      console.error('No file selected or file is undefined');
    }
  }

  addEmployee() {
    this.submitted = true;

    if (this.isFormValid()) {
      if (this.employee.dob) {
        const dob = new Date(this.employee.dob);
        const formattedDob = `${dob.getFullYear()}-${String(
          dob.getMonth() + 1
        ).padStart(2, '0')}-${String(dob.getDate()).padStart(2, '0')}`;
        this.employee.dob = formattedDob;
      }
      this.employee.id = this.createId();
      // this.employees.push(this.employee);
      this.employees.unshift(this.employee); // Add new employee to the beginning of the array
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Employee Created',
        life: 3000,
      });

      this.employees = [...this.employees];
      this.employeeDialog = false;
      this.employee = {};
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
        life: 3000,
      });
    }
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  isFormValid(): boolean {
    return !!(
      this.employee.firstName?.trim() &&
      this.employee.lastName?.trim() &&
      this.employee.email?.trim() &&
      this.employee.address?.trim() &&
      this.employee.dob &&
      this.employee.imageUrl &&
      this.employee.contactNumber?.trim() &&
      this.employee.salary
    );
  }

  createId(): number {
    let id = '';
    const chars = '0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return parseInt(id, 10);
  }

  deleteSelectedEmployees() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected employees?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.employees = this.employees.filter(
          (val) => !this.selectedEmployees.includes(val)
        );
        this.selectedEmployees = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Employees Deleted',
          life: 3000,
        });
      },
    });
  }

  deleteEmployee(employee: Employee) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' +
        employee.firstName +
        ' ' +
        employee.lastName +
        "'s record?",
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.employees = this.employees.filter((val) => val.id !== employee.id);
        this.employee = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Employee Deleted',
          life: 3000,
        });
      },
    });
  }
}
