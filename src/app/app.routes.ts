import { Routes } from '@angular/router';
import { ToolsListComponent } from './tools-list/tools-list.component';
import { ProjetcsComponent } from './projetcs/projetcs.component';
import { SectionToolComponent } from './section-tool/section-tool.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SectionToolGeometryComponent } from './section-tool-geometry/section-tool-geometry.component';

export const routes: Routes = [
    {path: '', component: ToolsListComponent},
    {path: 'projects', component: ProjetcsComponent},
    {path: 'connexion', component: ConnexionComponent},
    {path: 'subscription', component: SubscriptionComponent},
    {path: 'section-tool', component: SectionToolComponent},
    {path: 'section-tool/geometry', component: SectionToolGeometryComponent},
];
