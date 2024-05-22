import { Routes } from '@angular/router';
import { ToolsListComponent } from './tools-list/tools-list.component';
import { ProjetcsComponent } from './projetcs/projetcs.component';

export const routes: Routes = [
    {path: '', component: ToolsListComponent},
    {path: 'projects', component: ProjetcsComponent}
];
