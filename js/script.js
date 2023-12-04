document.addEventListener("DOMContentLoaded", function () {
  var listaCarrito = document.querySelector("#lista-carrito");
  var vaciar_carrito = document.querySelector("#vaciar-carrito");
  var carrito = [];
  imprimirPagina();
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("agregar-carrito")) {
      e.preventDefault();
      var cursoId = e.target.getAttribute("data-id");
      obtenerInformacionCurso(cursoId);
    }
  });
  vaciar_carrito.addEventListener("click", () => {
    carrito = [];
    actualizarCarritoUI();
    console.log(carrito);
  });

  function imprimirPagina() {
    const api = "/data/datos.json";

    fetch(api)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Crear un nuevo div para cada fila
        var rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        data.forEach(function (datos, index) {
          // Crear un nuevo div para cada curso
          var cursoDiv = document.createElement("div");
          cursoDiv.classList.add("four", "columns", "card");

          cursoDiv.innerHTML = `
            <img src="${datos.imagen}" class="imagen-curso u-full-width" />
            <div class="info-card">
              <h4>${datos.nombre}</h4>
              <p>${datos.instructor}</p>
              <img src="img/estrellas.png" />
              <p class="precio">$${datos.precio} <span class="u-pull-right">$15</span></p>
              <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${datos.id}">Agregar Al Carrito</a>
            </div>
          `;

          // Agregar el curso al div de la fila
          rowDiv.appendChild(cursoDiv);

          // Si hemos llegado al tercer curso, agregar la fila al contenedor principal y reiniciarla
          //ESTO ES DE CHATGPT, YA QUE ME IMPRIMÍA TODO DE FORMA DESORDENADA
          if ((index + 1) % 3 === 0 || index === data.length - 1) {
            document.getElementById("lista-cursos").appendChild(rowDiv);
            rowDiv = document.createElement("div");
            rowDiv.classList.add("row");
          }
        });
      })
      .catch(function (error) {
        console.error("Error: " + error);
      });
  }

  function obtenerInformacionCurso(id) {
    var api = "/data/datos.json";

    fetch(api)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        procesarDatosPromesa(data, id);
      })
      .catch(function (error) {
        console.error("Error: " + error);
      });
  }

  function procesarDatosPromesa(datosPromesa, id) {
    var cursoEncontrado = datosPromesa.find(function (curso) {
      return curso.id === id;
    });

    console.log("objeto promesa: " + cursoEncontrado);
    if (cursoEncontrado) {
      agregarAlCarrito(cursoEncontrado);
    } else {
      console.error("Error " + id);
    }
  }

  function agregarAlCarrito(curso) {
    var cursoExistente = carrito.find(function (item) {
      return item.id === curso.id;
    });

    if (cursoExistente) {
      cursoExistente.cantidad++;
    } else {
      console.log("agregando curso nuevo: " + curso);
      carrito.push(curso);
    }
    actualizarCarritoUI();
  }
  function borrarCarrito(curso) {
    var cursoExistente = carrito.find(function (item) {
      return item.id === curso.id;
    });

    if (cursoExistente) {
      var indiceAEliminar = carrito.indexOf(cursoExistente);

      // Utiliza splice en el array 'carrito' para eliminar el curso en el índice especificado
      carrito.splice(indiceAEliminar, 1);

      // Llama a la función para actualizar la interfaz de usuario del carrito después de eliminar
      actualizarCarritoUI();
    }
  }

  function actualizarCarritoUI() {
    listaCarrito.innerHTML = "";
    console.table(carrito);
    listaCarrito.innerHTML = `
    <tr>
    <th>Imagen</th>
    <th>Nombre</th>
    <th>Precio</th>
    <th>Cantidad</th>
    <th></th>
  </tr>
  `;
    carrito.forEach(function ({ nombre, precio, cantidad, id, imagen }) {
      var fila = document.createElement("tr");
      fila.innerHTML = `
      <td><img src="${imagen}" alt="${nombre}" style=" height: 50px;"></td>
                <td>${nombre}</td>
                <td>${precio}</td>
                <td>${cantidad}</td>
                <td><a href="#" class="borrar-curso" data-id="${id}">X</a></td>
            `;

      // Agrega un evento de clic a los enlaces "Eliminar" para llamar a la función borrarCarrito
      var enlaceEliminar = fila.querySelector(".borrar-curso");
      enlaceEliminar.addEventListener("click", function (e) {
        e.preventDefault();
        // Obtén el data-id del enlace clickeado
        var cursoId = e.target.getAttribute("data-id");
        // Encuentra el curso correspondiente en el carrito y llama a borrarCarrito
        var cursoAEliminar = carrito.find(function (curso) {
          return curso.id === cursoId;
        });
        if (cursoAEliminar) {
          borrarCarrito(cursoAEliminar);
        }
      });

      listaCarrito.appendChild(fila);
    });
  }
});
