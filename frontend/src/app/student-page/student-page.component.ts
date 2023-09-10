import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.scss']
})
export class StudentPageComponent {

  StudentArray : any[] =[];
  isResultLoaded = false;
  isUpdateFormActive = false;

  stName: string ="";
  dob: string ="";
  address: string ="";
  contactNumber: string ="";
  email: string ="";

  currentStudentId = "";

  constructor(private http: HttpClient)
  {
    this.getAllStudent();
  }

  ngOnInit(): void { }

  getAllStudent()
  {
    this.http.get("http://localhost:8000/api/student/").subscribe(
      (resultData: any)=>{
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.StudentArray = resultData.data;
    });
  }

  register()
  {
    let bodyData = {
      "stName" : this.stName,
      "dob":this.dob,
      "address":this.address,
      "contactNumber":this.contactNumber,
      "email":this.email,
    };

    this.http.post("http://localhost:8000/api/student/add", bodyData).subscribe((resultData: any) => {
    console.log(resultData);

    if (resultData.status) {
      this.getAllStudent();
      Swal.fire({
        icon: 'success',
        title: 'Student Added',
        text: 'The student has been added successfully!',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add the student. Please try again later.',
      });
    }
  });
  }

  setUpdate(data:any){
    this.stName = data.stName;
    this.dob = data.dob;
    this.address = data.address;
    this.contactNumber = data.contactNumber;
    this.email = data.email;

    this.currentStudentId = data.id;
  }

  UpdateRecords() {
    let bodyData = {
      "stName": this.stName,
      "dob": this.dob,
      "address": this.address,
      "contactNumber": this.contactNumber,
      "email": this.email,
    };

    Swal.fire({
      title: 'Confirm Update',
      text: 'Are you sure you want to update this student?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.put("http://localhost:8000/api/student/update" + "/" + this.currentStudentId, bodyData)
          .subscribe((resultData: any) => {
            console.log(resultData);

            if (resultData.status) {
              this.getAllStudent();
              Swal.fire({
                icon: 'success',
                title: 'Student Updated',
                text: 'The student has been updated successfully!',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update the student. Please try again later.',
              });
            }
          });
      }
    });
  }


  save(){
    if(this.currentStudentId == ''){
      this.register();
    }
    else{
      this.UpdateRecords();
    }
  }


  setDelete(data: any) {
    Swal.fire({
      title: 'Confirm Delete',
      text: 'Are you sure you want to delete this student?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete("http://localhost:8000/api/student/delete" + "/" + data.id).subscribe((resultData: any) => {
          console.log(resultData);

          if (resultData.status) {
            this.getAllStudent();
            Swal.fire({
              icon: 'success',
              title: 'Student Deleted',
              text: 'The student has been deleted successfully!',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete the student. Please try again later.',
            });
          }
        });
      }
    });
  }

}
