import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import { NotifierService } from './notifier.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private toast: NotifierService) { }

  formatarData(data: any) {
    const date = new Date(data);

    // Configura o fuso horário para o de Brasília
    const options = { timeZone: 'America/Sao_Paulo' };
    const dateBrasilia = new Date(date.toLocaleString('en-US', options));
    const day = dateBrasilia.getDate().toString().padStart(2, '0');
    const dayNext = dateBrasilia.getDate() + 1;
    const month = (dateBrasilia.getMonth() + 1).toString().padStart(2, '0');
    const year = dateBrasilia.getFullYear();
    const formatted = `${day}/${month}/${year}`;

    return formatted;
  }
  formatarDataToSQL(data: any) {
    data = data.split('/').reverse().join('/');
    data = new Date(data);
    return data;
  }

  formatarDataValue(data: any) {
    data = data.split('T')[0].split('-').reverse().join('/');
    return data;
  }

  formatDateToISO(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  formatterString(string: string) {
    string = string.toLowerCase();
    string = string.replace(/(^\w{1})|(\s+\w{1})/g, (letra) =>
      letra.toUpperCase()
    );

    return string;
  }

  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    const digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;

    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
      return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    const digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;

    if (digitoVerificador2 !== parseInt(cpf.charAt(10))) {
      return false;
    }

    return true;
  }

  verificarIdade18(dataNascimento: string | Date) {
    const dataNascimentoFormatada = this.formatarData(dataNascimento);

    const momentData = moment(dataNascimentoFormatada, 'DD/MM/YYYY');
    const years = moment().diff(momentData, 'years');

    return years >= 18;
  }

  decoteBase64(base64: string) {
    return atob(base64);
  }

  encodeBase64(base64: string) {
    return btoa(base64);
  }

  ordenarAlfabetico(array: any[]) {
    array.sort((a, b) => {
      if (a.nome > b.nome) {
        return 1;
      }
      if (a.nome < b.nome) {
        return -1;
      }
      return 0;
    });

    return array;
  }

  saveArquivo(data: Blob, extesion: string) {
    const contentDispositionHeader: string | null = 'file';
    const hash = this.generateSHA256Hash();
    const filenameRegex: RegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches: RegExpMatchArray | null = contentDispositionHeader
      ? contentDispositionHeader.match(filenameRegex)
      : null;
    const filename: string =
      matches && matches.length > 1 ? matches[1] : `${hash}.${extesion}`;

    saveAs(data, filename);
  }

  saveArquivoComNome(data: any, nomeArquivo: string) {
    saveAs(data, nomeArquivo);
    this.toast.showSucess('Relatório gerado com sucesso');
  }

  generateSHA256Hash(): string {
    const randomWord = this.generateRandomWord();
    return CryptoJS.MD5(randomWord).toString(CryptoJS.enc.Hex);
  }

  private generateRandomWord(): string {
    const randomWordLength = 10;
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomWord = '';
    for (let i = 0; i < randomWordLength; i++) {
      randomWord += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return randomWord;
  }

  remove_accents(strAccents: any) {
    strAccents = strAccents.split('');
    const strAccentsOut = [];
    const strAccentsLen = strAccents.length;
    const accents =
      'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëÇçðÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    const accentsOut =
      'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeCcdDIIIIiiiiUUUUuuuuNnSsYyyZz';
    for (let y = 0; y < strAccentsLen; y++) {
      if (accents.indexOf(strAccents[y]) != -1) {
        strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
      } else strAccentsOut[y] = strAccents[y];
    }
    strAccents = strAccentsOut.join('');

    return strAccents;
  }

  generateColors() {
    const o = Math.round,
      r = Math.random,
      s = 255;

    const blue = o(r() * s);
    const green = o(r() * 5);
    const red = o(r() * 5);

    return 'rgba(' + red + ',' + green + ',' + blue + ',' + 0.75 + ')';
  }

  generateColorsRandom() {
    const r = Math.floor(Math.random() * 256); // Valor de vermelho entre 0 e 255
    const g = Math.floor(Math.random() * 256); // Valor de verde entre 0 e 255
    const b = Math.floor(Math.random() * 256); // Valor de azul entre 0 e 255

    return 'rgba(' + r + ',' + g + ',' + b + ',' + 0.75 + ')';
  }

  showInvalidFields(form: any) {
    const invalidFields = [];
    const validFields = [];
    const controls = form.controls;
    for (const name in controls) {
      if (
        controls[name].invalid ||
        // controls[name].touched ||
        controls[name].errors?.['required']
      ) {
        invalidFields.push(name);
      } else {
        validFields.push(name);
      }
    }
    if (invalidFields.length > 0) {
      this.toast.showError('Campos inválidos');
      console.log('Campos inválidos: ' + invalidFields.join(', '));
      this.highlightInvalidFields(invalidFields, validFields);
    } else {
      console.log('Todos os campos estão válidos');
    }
  }

  private highlightInvalidFields(invalidFields: string[], validFields: string[]) {
    invalidFields.forEach((field) => {
      const inputElement = document.querySelector(
        `[formControlName="${field}"]`
      );
      const errorElement = document.getElementById(`${field}-message-error`);

      if (inputElement) {
        inputElement.classList.add('invalid-field');
      }

      if (errorElement) {
        errorElement.style.display = 'block';
      }
    });

    validFields.forEach((field) => {
      const inputElement = document.querySelector(
        `[formControlName="${field}"]`
      );
      const errorElement = document.getElementById(`${field}-message-error`);

      if (inputElement) {
        inputElement.classList.remove('invalid-field');
      }

      if (errorElement) {
        errorElement.style.display = 'none';
      }
    });
  }
}
