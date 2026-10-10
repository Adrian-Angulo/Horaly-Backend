
export class ColombiaHolidaysService {
  private static readonly cachePorAnio = new Map<number, Set<string>>();

 
  public static calcularDomingoPascua(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  /**
   * Aplica la regla de la Ley Emiliani: si el día no es lunes,
   * se traslada al lunes inmediatamente posterior.
   */
  private static trasladarAlSiguienteLunes(date: Date): Date {
    const dayOfWeek = date.getDay(); // 0: domingo, 1: lunes, ..., 6: sábado
    if (dayOfWeek === 1) {
      return date;
    }
    const diasHastaLunes = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const result = new Date(date);
    result.setDate(date.getDate() + diasHastaLunes);
    return result;
  }

  private static sumarDias(date: Date, dias: number): Date {
    const result = new Date(date);
    result.setDate(date.getDate() + dias);
    return result;
  }

  private static formatearIso(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Obtiene todos los festivos nacionales oficiales de Colombia para el año dado en formato ISO (`YYYY-MM-DD`).
   */
  public static obtenerFestivosPorAnio(year: number): Set<string> {
    if (this.cachePorAnio.has(year)) {
      return this.cachePorAnio.get(year)!;
    }

    const festivos = new Set<string>();

    // 1. Festivos Fijos (no se trasladan)
    festivos.add(this.formatearIso(new Date(year, 0, 1))); // 1 Ene: Año Nuevo
    festivos.add(this.formatearIso(new Date(year, 4, 1))); // 1 May: Día del Trabajo
    festivos.add(this.formatearIso(new Date(year, 6, 20))); // 20 Jul: Grito de Independencia
    festivos.add(this.formatearIso(new Date(year, 7, 7))); // 7 Ago: Batalla de Boyacá
    festivos.add(this.formatearIso(new Date(year, 11, 8))); // 8 Dic: Inmaculada Concepción
    festivos.add(this.formatearIso(new Date(year, 11, 25))); // 25 Dic: Navidad

    // 2. Festivos con Ley Emiliani (fecha fija trasladada al siguiente lunes)
    festivos.add(this.formatearIso(this.trasladarAlSiguienteLunes(new Date(year, 0, 6)))); // 6 Ene: Reyes Magos
    festivos.add(this.formatearIso(this.trasladarAlSiguienteLunes(new Date(year, 2, 19)))); // 19 Mar: San José
    festivos.add(this.formatearIso(this.trasladarAlSiguienteLunes(new Date(year, 5, 29)))); // 29 Jun: San Pedro y San Pablo
    festivos.add(this.formatearIso(this.trasladarAlSiguienteLunes(new Date(year, 7, 15)))); // 15 Ago: Asunción de la Virgen
    festivos.add(this.formatearIso(this.trasladarAlSiguienteLunes(new Date(year, 9, 12)))); // 12 Oct: Día de la Raza
    festivos.add(this.formatearIso(this.trasladarAlSiguienteLunes(new Date(year, 10, 1)))); // 1 Nov: Todos los Santos
    festivos.add(this.formatearIso(this.trasladarAlSiguienteLunes(new Date(year, 10, 11)))); // 11 Nov: Independencia de Cartagena

    // 3. Festivos dependientes de Pascua
    const pascua = this.calcularDomingoPascua(year);
    festivos.add(this.formatearIso(this.sumarDias(pascua, -3))); // Jueves Santo
    festivos.add(this.formatearIso(this.sumarDias(pascua, -2))); // Viernes Santo

    // 4. Festivos dependientes de Pascua con Ley Emiliani (trasladados al siguiente lunes)
    // Ascensión: Pascua + 40 días trasladado -> Pascua + 43 días (siempre lunes)
    festivos.add(this.formatearIso(this.sumarDias(pascua, 43)));
    // Corpus Christi: Pascua + 60 días trasladado -> Pascua + 64 días (siempre lunes)
    festivos.add(this.formatearIso(this.sumarDias(pascua, 64)));
    // Sagrado Corazón: Pascua + 68 días trasladado -> Pascua + 71 días (siempre lunes)
    festivos.add(this.formatearIso(this.sumarDias(pascua, 71)));

    this.cachePorAnio.set(year, festivos);
    return festivos;
  }

 
  public static obtenerFestivosEnRango(startDateIso: string, endDateIso: string): Set<string> {
    const startYear = parseInt(startDateIso.slice(0, 4), 10);
    const endYear = parseInt(endDateIso.slice(0, 4), 10);

    const festivos = new Set<string>();
    for (let y = startYear; y <= endYear; y++) {
      const yearFestivos = this.obtenerFestivosPorAnio(y);
      for (const f of yearFestivos) {
        if (f >= startDateIso && f <= endDateIso) {
          festivos.add(f);
        }
      }
    }
    return festivos;
  }

  
  public static esFestivo(dateIso: string): boolean {
    const year = parseInt(dateIso.slice(0, 4), 10);
    return this.obtenerFestivosPorAnio(year).has(dateIso);
  }
}
