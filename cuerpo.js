Cuerpo = {}

/*Cuerpo.nuevoCirculo = function(){
}
Cuerpo.nuevaRecta = function(){
}*/

Cuerpo.colisionador2Geometria = function(cuerpo){
  if(cuerpo.colisionador.tipo == COLISIONADOR.CIRCULO){
    let circulo = {
      x: cuerpo.pos_x,
      y: cuerpo.pos_y,
      radio: cuerpo.colisionador.radio,
      tipo: COLISIONADOR.CIRCULO
    };
    return circulo;
  }else if (cuerpo.colisionador.tipo == COLISIONADOR.RECTA) {
    let m = cuerpo.colisionador.pendiente;
    let b;
    if(m === undefined){
      b = cuerpo.pos_x;
    } else {
      b =cuerpo.pos_y - cuerpo.colisionador.pendiente * cuerpo.pos_x;
    }    
    let recta = {
      m: m,
      b: b,
      tipo: COLISIONADOR.RECTA
    }
    return recta;
  }
}
