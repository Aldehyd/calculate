import { Routes } from '@angular/router';
import { ToolsListComponent } from './tools-list/tools-list.component';
import { ProjetcsComponent } from './projetcs/projetcs.component';
import { SectionToolComponent } from './section-tool/section-tool.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SectionToolGeometryComponent } from './section-tool-geometry/section-tool-geometry.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { SectionToolAnalysisComponent } from './section-tool-analysis/section-tool-analysis.component';
import { SectionToolSollicitationComponent } from './section-tool-sollicitation/section-tool-sollicitation.component';
import { SectionToolAreaComponent } from './section-tool-area/section-tool-area.component';
import { SectionToolResultsComponent } from './section-tool-results/section-tool-results.component';
import { SubscriptionValidatedComponent } from './subscription-validated/subscription-validated.component';
import { WoodStrengthDeformationComponent } from './wood-strength-deformation/wood-strength-deformation.component';

export const routes: Routes = [
    {path: '', component: ToolsListComponent},
    {path: 'projects', component: ProjetcsComponent},
    {path: 'connexion', component: ConnexionComponent},
    {path: 'subscription', component: SubscriptionComponent},
    {path: 'subscription-validated/:key', component: SubscriptionValidatedComponent},
    {path: 'delete-account', component: DeleteAccountComponent},
    {path: 'section-tool', component: SectionToolComponent},
    {path: 'section-tool/geometry', component: SectionToolGeometryComponent},
    {path: 'section-tool/analysis', component: SectionToolAnalysisComponent},
    {path: 'section-tool/sollicitation', component: SectionToolSollicitationComponent},
    {path: 'section-tool/area', component: SectionToolAreaComponent},
    {path: 'section-tool/results', component: SectionToolResultsComponent},
    {path: 'wood-strength-deformation', component: WoodStrengthDeformationComponent},
    {path: '**', redirectTo: ''}
];
