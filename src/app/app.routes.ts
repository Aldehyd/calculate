import { Routes } from '@angular/router';
import { ToolsListComponent } from './tools-list/tools-list.component';
import { ProjetcsComponent } from './projetcs/projetcs.component';
import { SectionToolComponent } from './section-tool/section-tool.component';

export const routes: Routes = [
    {path: '', component: ToolsListComponent},
    {path: 'projects', component: ProjetcsComponent},
    {path: 'section-tool', component: SectionToolComponent},
];
