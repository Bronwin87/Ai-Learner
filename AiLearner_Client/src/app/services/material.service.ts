import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { MaterialRequestDTO } from '../models/MaterialRequestDTO';
import { MaterialDTO } from '../models/MaterialDTO';
import { environment } from '../../environments/environment.secret';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  secretUrl = environment.baseUrl;

  baseUrl = this.secretUrl + '/material';

  constructor(private http: HttpClient) {}

  registerMaterial(dto: MaterialRequestDTO): Observable<any> {
    return this.http
      .post(this.baseUrl, dto, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getMaterials(userId: string): Observable<MaterialDTO[]> {
    return this.http.get<MaterialDTO[]>(this.baseUrl, {
      withCredentials: true,
    });
  }

  getMaterialById(materialId: number): Observable<MaterialDTO> {
    return this.http.get<MaterialDTO>(
      this.baseUrl + '/material/' + materialId,
      { withCredentials: true }
    );
  }
  deleteMaterial(materialId: number): Observable<string> {
    return this.http.delete(this.baseUrl + '/' + materialId, {
      withCredentials: true,
      responseType: 'text'
    });
  }
}
