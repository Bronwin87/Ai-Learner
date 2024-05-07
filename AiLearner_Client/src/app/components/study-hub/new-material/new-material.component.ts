import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialService } from '../../../services/material.service';
import { MaterialRequestDTO } from '../../../models/MaterialRequestDTO';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from '../../../services/navigation.service';
@Component({
  selector: 'app-new-material',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-material.component.html',
  styleUrl: './new-material.component.css',
})
export class NewMaterialComponent {
  contentInput: string = '';
  userId: string | null = null;
  loading: boolean = false;

  constructor(
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private navigationService: NavigationService
  ) {
    
  }

  ngOnInit(){
    this.navigationService.setBackRoute(['study-hub']);
  }
  getInput(): void {
    this.loading = true;
    const dto: MaterialRequestDTO = {
      userId: '',
      content: this.contentInput,
      numOfQuestions: 10,
    };
    this.materialService.registerMaterial(dto).subscribe({
      next: (response) => {
        if (response.status === 201) {
          this.loading = false;
          this.toastr.success('Material registered successfully');
          this.router.navigate(['../materials'], { relativeTo: this.route });
        }
      },
      error: () => {
        this.loading = false;
        this.toastr.warning('Error registering material');
      },
    });
  }

}
