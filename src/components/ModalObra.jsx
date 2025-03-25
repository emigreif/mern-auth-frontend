// models/obra.js

ObraSchema.pre("save", async function (next) {
  if (!this.codigoObra) {
    const ultimaObra = await this.constructor
      .findOne({ user: this.user })
      .sort("-codigoObra");
    this.codigoObra = ultimaObra ? ultimaObra.codigoObra + 1 : 1;
  }

  if (this.fechaEntrega) {
    const entrega = new Date(this.fechaEntrega);
    const diasAntes = (d) => {
      const date = new Date(entrega);
      date.setDate(date.getDate() - d);
      return date;
    };

    this.fechaInicioCortePerfiles = diasAntes(15);
    this.fechaInicioArmado = diasAntes(10);
    this.fechaEnvidriado = diasAntes(7);
    this.fechaInicioMontaje = entrega;
    this.fechaMedicion = diasAntes(60);
  }

  next();
});
