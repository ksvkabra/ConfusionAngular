import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { baseURL } from '../shared/baseurl';
@Injectable({
  providedIn: 'root'
})
export class LeaderService {


  constructor(private http: HttpClient, 
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leaders')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  };

  getLeaderById(id: number): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leaders/' + id)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  };

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader[]>(baseURL + 'leaders?featured=true')
      .pipe(map(leaders => leaders[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
    };
}
