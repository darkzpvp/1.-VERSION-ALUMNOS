document.addEventListener("DOMContentLoaded", function () {
  // Selección de elementos del DOM
  var listaCarrito = document.querySelector("#lista-carrito");
  var vaciarCarrito = document.querySelector("#vaciar-carrito");
  var carrito = obtenerCarritoLocalStorage() || []; // Obtener carrito del localStorage

  obtenerCarritoYImprimirPagina(); // Inicializar página con contenido y carrito

  document.addEventListener("click", function (e) {
    // Manejar clics en botones "Agregar al Carrito"
    if (e.target.classList.contains("agregar-carrito")) {
      e.preventDefault();
      var cursoId = e.target.getAttribute("data-id");
      obtenerInformacionCurso(cursoId);
    }
  });

  vaciarCarrito.addEventListener("click", () => {
    // Vaciar el carrito al hacer clic en "Vaciar Carrito"
    carrito = [];
    actualizarCarritoUI();
    guardarCarritoLocalStorage();
    console.log(carrito);
  });

  function obtenerCarritoYImprimirPagina() {
    carrito = obtenerCarritoLocalStorage() || [];
    imprimirPagina(); // Cargar contenido de la página
  }

  function imprimirPagina() {
    const api = "/data/datos.json";

    fetch(api)
      .then(response => response.json())
      .then(data => {
        // Crear y mostrar contenido de la página
        var rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        data.forEach(({ imagen, nombre, instructor, precio, id }, index) => {
          // Crear un nuevo div para cada curso
          var cursoDiv = document.createElement("div");
          cursoDiv.classList.add("four", "columns", "card");

          cursoDiv.innerHTML = `
            <img src="${imagen}" class="imagen-curso u-full-width" />
            <div class="info-card">
              <h4>${nombre}</h4>
              <p>Pedro</p>
              <img src="img/estrellas.png" />
              <p class="precio">$${precio} <span class="u-pull-right">$15</span></p>
              <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${id}">Agregar Al Carrito</a>
            </div>
          `;

          // Agregar el curso al div de la fila
          rowDiv.appendChild(cursoDiv);

          // Si hemos llegado al tercer curso, agregar la fila al contenedor principal y reiniciarla
          if ((index + 1) % 3 === 0 || index === data.length - 1) {
            document.getElementById("lista-cursos").appendChild(rowDiv);
            rowDiv = document.createElement("div");
            rowDiv.classList.add("row");
          }
        });

        // Actualizar interfaz de carrito después de cargar la página
        actualizarCarritoUI();
      })
      .catch(error => {
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
    // Actualizar interfaz de carrito y guardar en el localStorage
    actualizarCarritoUI();
    guardarCarritoLocalStorage();
  }

  function borrarCarrito(curso) {
    var cursoExistente = carrito.find(function (item) {
      return item.id === curso.id;
    });

    if (cursoExistente) {
      var indiceAEliminar = carrito.indexOf(cursoExistente);
      carrito.splice(indiceAEliminar, 1);
      // Actualizar interfaz de carrito y guardar en el localStorage
      actualizarCarritoUI();
      guardarCarritoLocalStorage();
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

      var enlaceEliminar = fila.querySelector(".borrar-curso");
      enlaceEliminar.addEventListener("click", function (e) {
        e.preventDefault();
        var cursoId = e.target.getAttribute("data-id");
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

  function guardarCarritoLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function obtenerCarritoLocalStorage() {
    return JSON.parse(localStorage.getItem("carrito")) || null;
  }
});
