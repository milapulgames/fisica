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
    Canvas.circulo(objeto.pos_x, objeto.pos_y, objeto.radio || 10, Canvas.colores[i % Canvas.colores.length]);
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
