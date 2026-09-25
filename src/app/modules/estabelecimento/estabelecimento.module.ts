import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { RouterModule } from "@angular/router";
import { CadastroEstabelecimentoComponent } from "src/app/features/cms/estabelecimento/cadastro-estabelecimento/cadastro-estabelecimento.component";
import { EditEstabelecimentoComponent } from "src/app/features/cms/estabelecimento/edit-estabelecimento/edit-estabelecimento.component";
import { EstabelecimentoTableComponent } from "src/app/features/cms/estabelecimento/estabelecimento-table/estabelecimento-table.component";
import { InfoEstabelecimentoComponent } from "src/app/features/cms/estabelecimento/info-estabelecimento/info-estabelecimento.component";
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from "ng-apexcharts";
import { ToastrModule } from "ngx-toastr";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { EstabelecimentoRoutes } from "./estabelecimento.routing";
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared.module";
import { MatSortModule } from "@angular/material/sort";

@NgModule({
    declarations: [
        CadastroEstabelecimentoComponent,
        EditEstabelecimentoComponent,
        EstabelecimentoTableComponent,
        InfoEstabelecimentoComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(EstabelecimentoRoutes),
        ReactiveFormsModule,
        NgxMaskDirective,
        NgxMaskPipe,
        HttpClientModule,
        MatPaginatorModule,
        MatTableModule,
        NgApexchartsModule,
        ToastrModule.forRoot(),
        SharedModule,
        MatSortModule
    ],
    providers: [
        provideNgxMask({ dropSpecialCharacters: false })
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EstabelecimentosModulo {}