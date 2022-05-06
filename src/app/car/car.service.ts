import { Car } from './car.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  public baseUrl = "http://localhost:8080/cars";

  constructor(private http: HttpClient) {  }

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${environment.baseUrl}`);
  }

  createCar(car : Car): Observable<Car> {
    return this.http.post<Car>(`${environment.baseUrl}/create`, car);
  }

  readCar(id : number): Observable<Car> {
    return this.http.get<Car>(`${environment.baseUrl}/read/${id}`);
  }

  updateCar(id: number, car : Car): Observable<Car> {
    return this.http.put<Car>(`${environment.baseUrl}/update/${id}`, car);
  }

  deleteCar(id : number): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/delete/${id}`);
  }

}
