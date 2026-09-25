import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { PermissionsGuardService } from 'src/app/guards/permissions-guard.service';
import { Estabelecimento } from 'src/app/interfaces/dto/estabelecimento';
import { EstabelecimentoService } from 'src/app/routes/estabelecimento.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-estabelecimento-table',
  templateUrl: './estabelecimento-table.component.html',
  styleUrls: ['./estabelecimento-table.component.css']
})
export class EstabelecimentoTableComponent {

  value?: string;

  displayedColumns: string[] = ['id', 'estabelecimento', 'endereco', 'acoes'];

  permissions: any = [];

  estabelecimentoArray = new MatTableDataSource<Estabelecimento>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private estabelecimentoService: EstabelecimentoService, public dialog: MatDialog, private router: Router, 
    private notifier: NotifierService, private utilsService: UtilsService, public permissionService: PermissionsGuardService,
    private _liveAnnouncer: LiveAnnouncer) {}

    async ngOnInit(){
      this.permissions = await this.permissionService.generatePermission();
      await this.permissionService.verifyPermissions();
      this.initTable();
    }

    ngAfterViewInit(){
      this.estabelecimentoArray.paginator = this.paginator;
      this.estabelecimentoArray.sort = this.sort;
    }

    applyFilter(event: Event){
      let filterValue = (event.target as HTMLInputElement).value;
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.estabelecimentoArray.filter = filterValue;
    }

    getInfo(estabelecimento: Estabelecimento){
      this.router.navigateByUrl(`/cms/estabelecimento/info/${estabelecimento.id}`)
    }

    ativar(estabelecimento: Estabelecimento) {
  }

    openDialog(estabelecimento:any): void{
      const dialogRef = this.dialog.open(DialogComponent, {
        width: 'auto',
        data: { value: this.value },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if(result){
          this.estabelecimentoService.deleteEstabelecimento(estabelecimento.id).subscribe(() => {
            this.notifier.showSucess("Estabelecimento excluído com sucesso!");
            window.location.reload();
          },
        () => {
          this.notifier.showError("Erro ao exluir estabelecimento!");
        });
        }
      });
    }

    announceSortChange(sort: Sort) {
      if(sort.direction) {
        this._liveAnnouncer.announce(`Sorted ${sort.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }

    initTable() {
      this.estabelecimentoService.listarEstabelecimentos().subscribe((data: Estabelecimento[]) => {
        data.forEach((element: Estabelecimento) => {
          element.nome = this.utilsService.formatterString(element.nome);
        });

        this.estabelecimentoArray.data = data;
      });
    }

    getByInativo() {
      this.estabelecimentoArray.filter = 'Desativado';
    }

    getByAtivo(){
      this.estabelecimentoArray.filter = 'Ativo';
    }

    getEnderecoCompleto(estabelecimento: Estabelecimento){
      return `${estabelecimento.logradouro}, ${estabelecimento.bairro}, ${estabelecimento.numero}`;
    }
}
