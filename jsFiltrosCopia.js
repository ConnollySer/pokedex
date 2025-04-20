$(document).ready(function(){

 $("#btnSalir").click (function(){
    window.open("indexCopia.html");
 });

     // Evento click para el botón de búsqueda (#btnBuscar)
     $("#btnBuscar").click(function () {
        // Obtener el valor del campo de búsqueda, eliminar espacios en blanco y convertir a minúsculas
        let nombre = $("#buscador").val().trim().toLowerCase();

        // Validar si el campo de búsqueda está vacío
        if (!nombre) {
          
            alert("Por favor, introduce un nombre de Pokémon.");
            return; // Detener la ejecución si no hay nombre
        }

    

        // Realizar una solicitud GET a la API de Pokémon
        $.get(`https://pokeapi.co/api/v2/pokemon/${nombre}`, function (datos) {
            // Obtener la URL de la imagen oficial del Pokémon
            let spriteUrl = datos.sprites.other["official-artwork"].front_default;
            // Obtener el sonido del Pokémon
            let sonido = datos.cries.latest;

          
            // Mostrar la imagen del Pokémon en el contenedor correspondiente
            $("#contenedorImagen").html(
                spriteUrl ? `<img id="imgSprite" src="${spriteUrl}" data-sonido="${sonido}">`
                          : "<p>No hay imagen disponible.</p>"
            );

           
        }).fail(function () {
            // Manejar errores si no se encuentra el Pokémon
            $("#contenedorInfo").html("<p>No se encontró el Pokémon.</p>");
            $("#contenedorImagen").html(`
                                        <img src="img/personajes/gengar404.gif" alt="Pokémon no encontrado" style="scale: 1.22; " > `); 
        });
    });

    $("#btnShiny").click(function () {
        // Obtener el valor del campo de búsqueda, eliminar espacios en blanco y convertir a minúsculas
        let nombre = $("#buscador").val().trim().toLowerCase();

        // Realizar una solicitud GET a la API de Pokémon
        $.get(`https://pokeapi.co/api/v2/pokemon/${nombre}`, function (datos) {
            // Obtener la URL de la imagen Shiny del Pokémon
            let spriteUrl = datos.sprites.other["official-artwork"].front_shiny;
            // Obtener el sonido del Pokémon
            let sonido = datos.cries.latest;

            // Mostrar la imagen Shiny del Pokémon en el contenedor correspondiente
            $("#contenedorImagen").html(
                spriteUrl ? `<img id="imgSprite" src="${spriteUrl}" data-sonido="${sonido}">`
                          : "<p>No hay imagen disponible.</p>"
            );
        });
    });


    $("#btnTipo").click(function () {
        $.get("https://pokeapi.co/api/v2/type", function (datos) {
            let tipos = datos.results;
    
            let listaTipos = tipos.map(tipo =>
                `<li class="tipo-item" data-url="${tipo.url}">${tipo.name}</li>`
            ).join("");
    
            $("#contenedorInfo").html(`<ul>${listaTipos}</ul>`);
        }).fail(function () {
            $("#contenedorInfo").html("<p>Error al obtener los tipos.</p>");
        });
    });
    
    // Al hacer clic en un tipo
    $("#contenedorInfo").on("click", ".tipo-item", function () {
        let urlTipo = $(this).data("url");
    
        $.get(urlTipo, function (datos) {
            let listaPokemons = datos.pokemon.map(p => p.pokemon.name);
            $("#contenedorImagen").html("<p>Cargando imágenes...</p>");
    
            // Limpiar y empezar a cargar las imágenes
            $("#contenedorImagen").empty();
    
            // Para cada Pokémon, obtener su imagen
            listaPokemons.forEach(nombre => {
                $.get(`https://pokeapi.co/api/v2/pokemon/${nombre}`, function (dataPokemon) {
                    let spriteUrl = dataPokemon.sprites.other["official-artwork"].front_default;
                    let sonido = dataPokemon.cries.latest;
    
                    if (spriteUrl) {
                        let img = `<img class="poke-miniatura" src="${spriteUrl}" alt="${nombre}" title="${nombre}" data-sonido="${sonido}">`;
                        $("#contenedorImagen").append(img);
                    }
                });
            });
    
        }).fail(function () {
            $("#contenedorImagen").html("<p>Error al obtener los Pokémon de este tipo.</p>");
        });
    });
    
    
    $("#contenedorImagen").on("click", ".poke-miniatura", function () {
        let nombre = $(this).attr("alt");
    
        $.get(`https://pokeapi.co/api/v2/pokemon/${nombre}`, function (datos) {
            let tipos = datos.types.map(t => t.type.name).join(", ");
            let altura = datos.height / 10; // en metros
            let peso = datos.weight / 10;   // en kg
            let movimientos = datos.moves.slice(0, 5).map(m => m.move.name).join(", ");
    
            let infoHTML = `
                <h3>${nombre.toUpperCase()}</h3>
                <p><strong>Tipo:</strong> ${tipos}</p>
                <p><strong>Altura:</strong> ${altura} m</p>
                <p><strong>Peso:</strong> ${peso} kg</p>
                <p><strong>Movimientos:</strong> ${movimientos}</p>
            `;
    
            $("#contenedorInfo").html(infoHTML);
        });
    });
    






});