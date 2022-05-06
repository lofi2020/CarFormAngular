import { Car } from './car.model';
import { TestBed } from '@angular/core/testing';
import {  HttpClientModule, HttpResponse } from '@angular/common/http';
import { CarService } from './car.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

const dummyCars: Car[] =
[
  {
      "id": 1,
      "sign": "B-NB43243",
      "fin": "AZDNE-343243",
      "branch": "Berlin-Mitte"
  },
  {
      "id": 2,
      "sign": "B-VN3543",
      "fin": "UNGSSN-458433",
      "branch": "Berlin-Mitte"
  }
];

describe('CarService', () => {
  let service: CarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
    });
    service = TestBed.inject(CarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should retrieve cars form the API via GET', () => {
    //expect(service).toBeTruthy();
    service.getCars().subscribe(cars => {
      expect(cars.length).toBe(2);
      expect(cars).toEqual(dummyCars);
    }
    );
    const request = httpMock.expectOne(service.baseUrl);
    expect(request.request.method).toBe('GET');
    request.flush(dummyCars);
  });
}
);
