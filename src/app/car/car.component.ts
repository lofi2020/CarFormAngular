
import { CarService } from './car.service';
import { Component, OnInit } from '@angular/core';
import { Car } from './car.model';
import { FormBuilder, FormGroup, NgForm, NgControl,  Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  cars: Car[] = [];

  filteredCars: Car[] = [];

  carForm! : FormGroup;

  selectedCar?: Car;

  currentMode = 'add';

  searchText = '';

  constructor(private carService: CarService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loadCars();
    this.filteredCars  = Object.assign([], this.cars);
    this.initForm();
  }

  initForm() {
    this.carForm = this.formBuilder.group({
      'id' : [0],
      'sign': ['', Validators.required],
      'fin': ['', Validators.required],
      'branch': ['', Validators.required]
    }
    );
  }

  updateForm() {
    const jsonText = JSON.stringify(this.selectedCar);
    this.carForm.setValue(JSON.parse(jsonText));
  }

  loadCars(): void {
    this.searchText = '';
    this.carService.getCars().subscribe((data: Car[]) => {
      this.cars = data;
      this.filteredCars = Object.assign([], this.cars);
    });
  }

  loadCar(id: number): void {
    this.carService.readCar(id).subscribe(
      {
        next: (car : Car) => {
          this.selectedCar = car;
          this.showAlert("Neuer Datensatz wurde geladen", 'success');
        },
        error: (error) => {
          console.error(error.message);
          this.showAlert(error.error, 'danger');
        }
      }
    );
  }

  /**
   * Refresh table by clicking on refresh button
   */
  onRefresh(): void {
    this.selectedCar = undefined;
    this.loadCars();
  }

   /**
   * Open Dialog by clicking on the buttons to add/edit/delete/show car
   */
  onOpenModal(mode: string, car?: Car) {
    this.currentMode = mode;
    const button = document.getElementById('openDlgBtn');
    if(mode == 'add') {
      this.selectedCar = new Car();
      this.updateForm();
      this.carForm.enable();
      button!.setAttribute('data-target', '#carDlg');
    } else if(mode == 'edit') {
      this.selectedCar = car!;
      this.updateForm();
      this.carForm.enable();
      button!.setAttribute('data-target', '#carDlg');
    } else if(mode == 'delete') {
      this.selectedCar = car!;
      button!.setAttribute('data-target', '#deleteConfirmDlg');
    } else if(mode == 'show') {
      this.selectedCar = car!;
      this.updateForm();
      this.carForm.disable();
      button!.setAttribute('data-target', '#carDlg');
    } else {
      alert("Unbekannte Operation");
      return;
    }
    button!.click();
  }

   /**
   * Reset form clicking on the reset button
   */
  onReset(): void {
    if (this.currentMode == 'edit') {
      this.updateForm();
    } else {
      this.carForm.reset();
    }
  }

  /**
   * Update car by clicking on the update button
   */
  onUpdateCar(): void {
    const car = this.carForm.getRawValue();
    this.carService.updateCar(this.selectedCar!.id, car).subscribe({
      next: (v : Car) => {
        console.log(v);
        this.loadCars();
        this.showAlert("Datensatz wurde aktualisiert.", 'success');
        document.getElementById("closeModalButton")!.click();
      },
      error: (error) => {
        console.error(error.message);
        this.showMessage(error.error, 'danger');
      }
  });
  }

  /**
   * Create car by clicking on the create button
   */
  onCreateCar(): void {
    const car = this.carForm.getRawValue();
    this.carService.createCar(car).subscribe(
      {
        next: (v : Car) => {
          console.log(v);
          this.loadCars();
          this.showAlert("Neuer Datensatz wurde erfolgreich hinzugefügt", 'success');
          document.getElementById("closeModalButton")!.click();
        },
        error: (error) => {
          console.error(error.message);
          this.showMessage(error.error, 'danger');
        }
      }
    );
  }

  /**
   * Delete car by clicking on the delete button
   */
  onDeleteCar(): void {
    this.carService.deleteCar(this.selectedCar?.id!).subscribe(
      {
      next: () => {
        this.onRefresh();
        this.showAlert("Datensatz wurde erfolgreich gelöscht", 'success');
      },
      error: (error) => {
        console.error(error.message);
        this.showAlert(error.error, 'danger');
      }
      }
    );
  }

  /**
   * Filter cars by clicking on search button or entering search field
   */
  onFilter(): void {
    if(this.searchText){
      console.log("Filter..." + this.searchText);
      this.filteredCars  = Object.assign([], this.cars).filter(
          (car : Car) =>
          car.sign.toLowerCase().includes(this.searchText.toLowerCase()) ||
          car.fin.toLowerCase().includes(this.searchText.toLowerCase()) ||
          car.branch.toLowerCase().includes(this.searchText.toLowerCase())
     );
    } else {
      this.filteredCars  = Object.assign([], this.cars);
    }
  }

  /**
   * Show alert with content and type after closing form
   * @param message
   * @param type
   */
  showAlert(message: string, type: string): void {
    const alert = document.getElementById('alert');
    alert!.textContent = message;
    alert!.setAttribute('class', 'glow alert-' + type);
    alert!.setAttribute('style', 'display:block;');
    setTimeout(() => {
      alert!.setAttribute('style', 'display:none;');
    }, 4000)
  }

  /**
   * Show message with content and type while editing form
   * @param message
   * @param type
   */
  showMessage(message: string, type: string): void {
    const alert = document.getElementById('editMessage');
    alert!.textContent = message;
    alert!.setAttribute('class', 'alert alert-' + type);
    alert!.setAttribute('style', 'display:block;');
    setTimeout(() => {
      alert!.setAttribute('style', 'display:none;');
    }, 3000)
  }
}
