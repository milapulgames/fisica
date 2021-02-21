const Canvas = {
  colores: ["#f00","#0f0","#00f","#ff0","#f0f","#0ff"]
};

// Inicializa todo lo necesario una vez que se termina de cargar la página
Canvas.inicializar = function() {
  Canvas.div = document.getElementById('canvas');
  Canvas.contexto = Canvas.div.getContext("2d");
  Canvas.div.width = 2*window.innerWidth/3;
  Canvas.div.height = window.innerHeight-50;
  Canvas.actualizar(DATOS.cuerpos);
};

// Refresca lo que muestra el canvas
Canvas.actualizar = function(cuerpos) {
  Canvas.limpiar();
  let i = 0;
  for (k in cuerpos) {
    let objeto = cuerpos[k];
    switch (objeto.colisionador.tipo) {
      case COLISIONADOR.CIRCULO:
        Canvas.circulo(objeto.pos_x, objeto.pos_y, objeto.colisionador.radio, Canvas.colores[i % Canvas.colores.length]);
        break;
      case COLISIONADOR.RECTA:
        Canvas.recta(objeto.pos_x, objeto.pos_y, objeto.colisionador.pendiente, Canvas.colores[i % Canvas.colores.length]);
        break;
      case COLISIONADOR.SEGMENTO:
        Canvas.segmento({x: objeto.pos_x, y: objeto.pos_y}, {x: objeto.pos_x+objeto.colisionador.hasta.x, y: objeto.pos_y+objeto.colisionador.hasta.y}, Canvas.colores[i % Canvas.colores.length]);
        break;
      default:
        //
    }
    i++;
  }
};

// Borra todo lo que haya en el canvas
Canvas.limpiar = function() {
  Canvas.contexto.clearRect(0, 0, Canvas.div.width, Canvas.div.height);
};

Canvas.circulo = function(x, y, r, color) {
  Canvas.contexto.beginPath();
  Canvas.contexto.fillStyle = color;
  Canvas.contexto.arc(x,y,r,0,2*Math.PI);
  Canvas.contexto.fill();
  Canvas.contexto.closePath();
};

Canvas.recta = function(x, y, m, color) {
  let intersecciones;
  if (m === undefined) { // Vertical
    intersecciones = [
      {x:x, y:0}, {x:x, y:Canvas.div.height}
    ];
  } else if (m == 0) { // Horizontal
    intersecciones = [
      {x:0, y:y}, {x:Canvas.div.width, y:y}
    ];
  } else {
    let recta = {
      m: m,
      b: y-m*x // y = m*x+b <=> b = y-m*x
    };
    intersecciones = [
      Canvas.interseccionRectaRecta({m:0, b:0}, recta),
      Canvas.interseccionRectaRecta({m:0, b:Canvas.div.height}, recta)
    ];
  }
  Canvas.contexto.beginPath();
  Canvas.contexto.strokeStyle = color;
  Canvas.contexto.lineTo(intersecciones[0].x, intersecciones[0].y);
  Canvas.contexto.lineTo(intersecciones[1].x, intersecciones[1].y);
  Canvas.contexto.stroke();
  Canvas.contexto.closePath();
};

Canvas.segmento = function(desde, hasta, color) {
  Canvas.contexto.beginPath();
  Canvas.contexto.strokeStyle = color;
  Canvas.contexto.lineTo(desde.x, desde.y);
  Canvas.contexto.lineTo(hasta.x, hasta.y);
  Canvas.contexto.stroke();
  Canvas.contexto.closePath();
};

// TODO: Esto debería pasar a Geometria.js
Canvas.interseccionRectaRecta = function(recta1, recta2) {
  if (recta1.m === recta2.m) { // Paralelas
    return undefined;
  }
  if (recta1.m === undefined) { // La primera es vertical
    return {x: recta1.b, y: recta1.b*recta2.m+recta2.b};
  }
  if (recta2.m === undefined) { // La segunda es vertical
    return {x: recta2.b, y: recta2.b*recta1.m+recta1.b};
  }
  // m1*x+b1 = m2*x+b2 <=> (m1-m2)*x = b2-b1 <=> x = (b2-b1) / (m1-m2)
  let x = (recta2.b-recta1.b) / (recta1.m-recta2.m);
  return {x: x, y: recta1.m*x + recta1.b};
};
