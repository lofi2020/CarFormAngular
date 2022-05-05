import { Car } from './car.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  public baseUrl = "http://localhost:8080/cars";

  constructor(private http: HttpClient) {  }

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.baseUrl}`);
  }

  createCar(car : Car): Observable<Car> {
    return this.http.post<Car>(`${this.baseUrl}/create`, car);
  }

  readCar(id : number): Observable<Car> {
    return this.http.get<Car>(`${this.baseUrl}/read/${id}`);
  }

  updateCar(id: number, car : Car): Observable<Car> {
    return this.http.put<Car>(`${this.baseUrl}/update/${id}`, car);
  }

  deleteCar(id : number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

}
