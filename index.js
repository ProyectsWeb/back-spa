const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require("path");

const app = express();
/* app.use(express.json()) */
/* MIDELWARE PARA BODYPARSER Se utiliza para la base de datos*/
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
/* cardContent = [
    {
    title: "Tecnologia",
    img: "https://placeimg.com/200/200/tech"
},
    {
    title: "Animales",
    img: "https://placeimg.com/200/200/animals"
},
    {
    title: "Arquitectura",
    img: "https://placeimg.com/200/200/arch"
},
    {
    title: "Gente",
    img: "https://placeimg.com/200/200/people"
},
    {
    title: "Naturaleza",
    img: "https://placeimg.com/200/200/nature"
}
]
 */

//app.use(express.static(path.join(__dirname, "public")));

/* app.use('/', (req, res) =>{
    res.sendFile(path.join(__dirname+"index.html"));
}); */

app.get('/', (req, res) =>{
    res.json({nombre: "Jorge", apellido: "Peraza"})
    /* console.log( res.json({nombre: "Jorge", apellido: "Peraza"})) */
});




app.get("/variables", (reques, response) =>{     
    const misDatos = { nombre: "Jorge", apellido: "Peraza", edad: 47, profesion: "codigos" }

    response.send( `<h2>Mis datos: ${misDatos.nombre}, ${misDatos.apellido}, ${misDatos.edad}, ${misDatos.profesion}</h2>`);    
   
});



/* CONEXION A LA BASE DE DATOS */
let Schema = mongoose.Schema;

const cadenaConexion = "mongodb://localhost/Personas";

 mongoose.connect(cadenaConexion, {
     useNewUrlParser: true,    
    useUnifiedTopology: true
},    (err, res)=>{

        if(err){
            console.log(err)
        }else{
            
            console.log("Se conecto correctamente a la base de datos");       
        }
    });    

    let objeto = new Schema({
        _id: Schema.Types.String,
        nombre: Schema.Types.String,
        cantidad: Schema.Types.String,
        precio: Schema.Types.Number,
        vencimiento: Schema.Types.Date,        
        iidTipoCategoria: Schema.Types.String
    }, {collection: "Productos"});   

    /* {collection: "Productos"}, {versionKey: false} */
        /* este codigo de {versionKey: false} sirve para que al grabar no me aparezca la version al final del registro, __v: 0 AUNQUE A MI NO ME FUNCIONO ESTE PUNTO DEL versionKey: false */

    let Productos = mongoose.model("Productos", objeto);

    /* ME FUNCIONO CORRECTAMENTE ESTA busqueda (mostrar) */
    /* MOSTRAR -TODOS LOS DATOS DE LA COLECCION ESPECIFICADA DE LA BASE DE DATOS*/
   /*  ESTA ES CON FUNCION EXPRESADA */
    const mostrar = async ()=>{
        const productos = await Productos.find()
       console.log(`DE MI PRIMERA FUNCION: ${JSON.stringify(productos)}`);    
       if(productos !==""){
        app.get("/productos", (request, response)=>{
            response.send(productos)
        })
       }       
       return productos;         
       /*  ESTE RETURN ME SIRVE PARA QUE PUEDA LLAMAR A ESTA FUNCION EN OTRA QUE ESTA ABAJO,  SINO FUERA POR ESO LA PODRIA QUITAR */
    }

    /*  ESTA ES LA MISMA FUNCION PERO CON FUNCION DECLARADA */
    /* async function mostrar(){
        const productos = await Productos.find()
        console.log(productos);           
       return productos;          
    } */
      

   /*  mostrar(); */

    /* CREAR UN REGISTRO */
    const crear = async ()=>{
            /* Esta es una instancia de mi schema Productos para poder crear un documento o registro a la base de datos, es necesario ponerlo en singular*/
            /* Estos valores que se registran, son valores estaticos como un ejemplo, es necesario hacerlo dinamicamente */
           /*  este es una instancia de la variable de arriba let Productos = mongoose.model("Productos", objeto); */
        const producto = new Productos({
            _id: 14,
            nombre: "Litera",
            cantidad: 1,
            precio: 8700.2,
            vencimiento: "2022-08-02T00:00:00.000+00:00",
            iidTipoCategoria: 1
        });

        const registroProducto = await producto.save();
        console.log(registroProducto);
    }

    /* EDITAR REGISTRO */
      /*   Para actualizar un registro se utiliza el id del registro a modificar y aqui lo pusimos como parametro */
    const actualizar = async (id)=>{
        const producto = await Productos.updateOne( {_id: id},
            { $set: {
                nombre: "Litera MODIFICADA"
                    }
            }    
        )    
    }

   /*  BORRAR REGISTRO */
    const eliminar = async (id)=>{
        const producto = await Productos.deleteOne({_id: id});
        console.log(producto)
    }




/* LLAMAMOS A LAS FUNCIONES DE CRUD -Les puse comentario para que no se me ejecutaran cada vez que guarde*/
   /*  mostrar(); */
   /*  crear() */
   /*  actualizar('14') */ /* este es un ejemplo de un numero de id de acuerdo a mi coleccion de mi base de datos Personas.Productos */
   /*  eliminar('9') */ /* este es un ejemplo de un numero de id de acuerdo a mi coleccion de mi base de datos Personas.Productos */





    /* app.get("/productos", (request, response) =>{          
         Productos.find({})
         .exec( (err, data) =>{
             if(err){
                 return response.json({
                     status: 500,
                     mensaje: "Error en la peticion"
                 });
             }
    
             response.json({
                 status: 200,
                 data: data             
             });
            
         });        
     }); */

     /* AQUI ESTOY usando o MANDANDO LLAMAR A LA FUNCION mostrar() de arriba y EL RESULTADO LO MANDO A LA RUTA /productosss */
    mostrar().then( resultado =>{
        console.log(`Este es DENTRO DE LA FUNCION: ${JSON.stringify(resultado)}`)       
       /*  Mi codigo */
       let miResultado = JSON.stringify(resultado);
       console.log(`ESTE ES DE MI RESULTADO EN VARIABLE: ${miResultado}`)

       if(miResultado !== ""){
           console.log("LO ESTAS LOGRANDO")
           
          /*  UNA VEZ VALIDADO SI EXISTEN DATOS PASE A CREAR LA RUTA */
           app.use("/productosss", (request, response)=>{
               response.send(miResultado)
           })
       }
       /*  return JSON.stringify(resultado); */
    }).catch( error =>{
       let errorConsulta = JSON.stringify(error);        
        console.log(errorConsulta)
        if(errorConsulta){
            app.get("/productosss", (request, response)=>{
                response.send(errorConsulta)
            })
        }
    }) 

   
/* console.log(`ESTO ES DE MIS misProductos: ${misProductos}`) */
    

    /*  let misProductos = mostrar().then( resultado => console.log(resultado)).catch( error => console.log(error)) */
   
    /*  app.use("/productos", (request, response)=>{  */ 
        /*  response.send() */
       
      /*  response.send([{"_id":"1","nombre":"Televisor","cantidad":"4","precio":1950.6,"vencimiento":"2022-08-07T00:00:00.000Z","iidTipoCategoria":"1"},{"_id":"2","nombre":"Lavadora","cantidad":"9","precio":1562.7,"vencimiento":"2025-05-13T00:00:00.000Z","iidTipoCategoria":"2"},{"_id":"3","nombre":"Computadora","cantidad":"2","precio":1650,"vencimiento":"2021-02-08T00:00:00.000Z","iidTipoCategoria":"3"},{"_id":"4","nombre":"Licuadora","cantidad":"7","precio":1230,"vencimiento":"2023-01-29T00:00:00.000Z","iidTipoCategoria":"3"},{"_id":"5","nombre":"Olla Arrocera","cantidad":"5","precio":1020.8,"vencimiento":"2024-03-16T00:00:00.000Z","iidTipoCategoria":"2"},{"_id":"6","nombre":"Hervidor","cantidad":"8","precio":82,"vencimiento":"2027-07-21T00:00:00.000Z","iidTipoCategoria":"1"},{"_id":"7","nombre":"Horno","cantidad":"6","precio":1500,"vencimiento":"2022-04-25T00:00:00.000Z","iidTipoCategoria":"2"},{"_id":"8","nombre":"Cafetera","cantidad":"1","precio":190,"vencimiento":"2029-03-10T00:00:00.000Z","iidTipoCategoria":"2"},{"_id":"10","nombre":"Ventilador","cantidad":"10","precio":562.9,"vencimiento":"2021-01-19T00:00:00.000Z","iidTipoCategoria":"3"},{"_id":"11","nombre":"Regrigerador","cantidad":"2","precio":1950.6,"vencimiento":"2022-04-07T00:00:00.000Z","iidTipoCategoria":"1","__v":0},{"_id":"12","nombre":"Sala","cantidad":"1","precio":12500.5,"vencimiento":"2022-03-05T00:00:00.000Z","iidTipoCategoria":"1","__v":0},{"_id":"13","nombre":"Aire Acondicionado","cantidad":"1","precio":8700.2,"vencimiento":"2022-05-02T00:00:00.000Z","iidTipoCategoria":"1","__v":0},{"_id":"14","nombre":"Litera MODIFICADA","cantidad":"1","precio":8700.2,"vencimiento":"2022-08-02T00:00:00.000Z","iidTipoCategoria":"1","__v":0}])
       */
    /*  })  */
    

    /* ESTA PARTE ES MI CODIGO DE CONEXION A LA BASE DE DATOS Personas Y A LA COLECCIO Articulos */

    let objetoArticulos = new Schema({
                _id: Schema.Types.String,
                nombre: Schema.Types.String,
                categoria: Schema.Types.String,
                cantidad: Schema.Types.String,
                precio: Schema.Types.Number,
                img: Schema.Types.String
        
         }, {collection: "Articulos"});

         let Articulos = mongoose.model("Articulos", objetoArticulos);

         const mostrarArticulos = async ()=>{
            const articulos = await Articulos.find()
           console.log(`DE MI SEGUNDA FUNCION: ${JSON.stringify(articulos)}`);    
           if(articulos !==""){
            app.get("/articulos", (request, response)=>{
                response.send(articulos)
            })
           }       
           return articulos;         
           /*  ESTE RETURN ME SIRVE PARA QUE PUEDA LLAMAR A ESTA FUNCION EN OTRA QUE ESTA ABAJO,  SINO FUERA POR ESO LA PODRIA QUITAR */
        }

        mostrarArticulos()


       app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), ()=>{
    console.log("Servidor funcionando")
});