import { Component, OnDestroy } from '@angular/core';
import { MaterialDTO } from '../../../models/MaterialDTO';
import { MaterialService } from '../../../services/material.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-materials-screen',
  standalone: true,
  imports: [CommonModule, FormatDatePipe, RouterLink],
  templateUrl: './materials-screen.component.html',
  styleUrl: './materials-screen.component.css',
})
export class MaterialsScreenComponent implements OnDestroy {
  userId: string | null = null;
  private subscription: Subscription;
  expandedState: Record<number, boolean> = {};

  materials: MaterialDTO[] | null =  null;

  constructor(
    private materialService: MaterialService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.subscription = this.userService.userId$.subscribe((id) => {
      this.userId = id;
    });
  }

  ngOnInit(): void {
    this.loadMaterials();
    this.subscription = this.userService.userId$.subscribe((id) => {
      this.userId = id;
      if (this.userId) {
        this.loadMaterials();
      }
    });
  }
  
  toggleExpanded(materialId: number): void {
    this.expandedState[materialId] = !this.expandedState[materialId];
  }

  loadMaterials(): void {
    this.materialService.getMaterials(this.userId!).subscribe({
      next: (materials: MaterialDTO[]) => {
        this.materials = materials;
      },
      error: (error) => {
        this.toastr.info(`you havent uploaded any materials yet!`);
        this.router.navigate(['/study-hub/new-material']);
      },
    });
  }

  navigateToMaterial(material: MaterialDTO) {
    this.router.navigate(['/study-hub/materials', material.id], { state: { material: material } });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
