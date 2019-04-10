import { TestBed } from '@angular/core/testing';

import { EmployeeesService } from './employeees.service';

describe('EmployeeesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmployeeesService = TestBed.get(EmployeeesService);
    expect(service).toBeTruthy();
  });
});
