var peticionHttp = new XMLHttpRequest();
var nombreModificar;
var cuatrimestreModificar;
var fechaFinalModificar;
window.addEventListener("load",cargar);
function cargar(){ 
    TraerUsuarios();
}   
/**
 Cuando se termine de cargar la página index se tiene que traer del servidor todas las
materias que estén cargadas, ejecutando el método GET
http://localhost:3000/materias lo cual devolverá un Array de objetos JSON con los
siguientes valores: id, nombre, cuatrimestre, fechaFinal y turno. Cree el contenido de
la table utilizando los objetos del DOM.
 */
function TraerUsuarios()
{
    peticionHttp.onreadystatechange = callback;
    peticionHttp.open("GET","http://localhost:3000/materias",true);
    peticionHttp.send();
    function callback(){
        if(peticionHttp.readyState===4){
            if(peticionHttp.status===200){
                var tcuerpo = document.getElementById("tCuerpo");
                var respuesta = peticionHttp.responseText;
                var json = JSON.parse(respuesta);

                for (var i = 0; i < json.length; i++) {
                    var row = document.createElement("tr");//fila
                    var colID = document.createElement("td");//columna id
                    var colN = document.createElement("td");//columna nombre
                    var colCuatri = document.createElement("td");//columna acuatrimestre
                    var colF = document.createElement("td");//columna fecha final
                    var colTurno = document.createElement("td");//columna turno
                    var idText = document.createTextNode(json[i].id);//texto id
                    var noText = document.createTextNode(json[i].nombre);//texto nombre
                    var cuText = document.createTextNode(json[i].cuatrimestre);//texto cuatrimestre
                    var feText = document.createTextNode(json[i].fechaFinal);//texto fecha final
                    var tuText = document.createTextNode(json[i].turno);//texto turno
                    colID.appendChild(idText);  
                    colN.appendChild(noText);                   
                    colCuatri.appendChild(cuText);
                    colF.appendChild(feText);
                    colTurno.appendChild(tuText);
                    row.appendChild(colID);
                    row.appendChild(colN);
                    row.appendChild(colCuatri);
                    row.appendChild(colF);
                    row.appendChild(colTurno);
                    tcuerpo.appendChild(row);//agrego la fila al "tcuerpo"
                    spinner.hidden = true;
                  }               
            }
        }
    }
}       
/*
El botón Modificar deber enviar el objeto JSON completo, con los datos modificado (excepto el id y el cuatrimestre). 
Una vez que devuelva el servidor debe modificar los valores de la materia, SIN volverse a consultar al servidor la lista. 
Modificar los datos utilizando los objetos del DOM si la respuesta del servidor es {'type': 'ok'}
Previo al envió al servidor, tiene que validarse que los campos estén correctamente cargados, 
de lo contrario deberá marcar en rojo el borde de los input que no cumplan con la condición:
Materia: debe tener más de 6 caracteres.
Fecha: debe ser mayor al día de hoy.
Turno: debe haber uno seleccionado.
Cuatrimestre: debe visualizarse el select pero deshabilitado 
url servidor: http://localhost:3000/editar

*/

window.addEventListener("load",function(){
    var spinner = document.getElementById("spinner");
    spinner.hidden = false;
    var id = document.getElementById("tntid");
    var nombre = document.getElementById("tntnom");
    var cuatrimestre = document.getElementById("selectcuatri");
    var fechaFinal = document.getElementById("txtfecha");
    var turno = document.getElementsByName("radioTurno");
    var btn = document.getElementById("btnGuardar");
    btn.addEventListener("click",function(){
        spinner.hidden = false;
    if (nombre.value.length >= 6 && cuatrimestre.disabled == true && !isDateLessThanToday(fechaFinal.value) && (turno.value === "Mañana" || turno.value === "Noche")) {
        nombreModificar = nombre.value;
        cuatrimestreModificar = cuatrimestre.value;
        fechaFinalModificar= fechaFinal.value;
        if (turno[0].checked == true) {
            turnoToModify = "Mañana";
        } else if (turno[1].checked == true) {
            turnoToModify = "Noche";
        }
        nombre.className = "sinError";
        fechaFinal.className = "sinError";
        containerForm.hidden = true;
        peticionHttp.onreadystatechange = respuestaPost;
        peticionHttp.open("POST","http://localhost:3000/editar",true);
        peticionHttp.setRequestHeader("content-type","application/json");
        peticionHttp.send(JSON.stringify({'id':id,'nombre':nombre,'cuatrimestre':cuatrimestre,'fechaFinal':fechaFinal,'turno':turno}));
        function respuestaPost(){
            if(peticionHttp.readyState==4){
                if(peticionHttp.status==200){
                    
                var body = document.getElementById("tCuerpo");
                var rows = body.rows;              
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].id == (id-1)) {
                        rows[i].firstElementChild.textContent = nombreModificar;
                        rows[i].firstElementChild.nextElementSibling.textContent = cuatrimestreModificar;
                        rows[i].firstElementChild.nextElementSibling.nextElementSibling.textContent = fechaFinalModificar;
                        rows[i].firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent = fechaFinalModificar;
                    }
                }

                spinner.hidden = true;
                }else{
                    alert("ERROR");
                }
            }
        }

    } else {
        if (nombre.value.length < 6) {
            nombre.className = "conError";
        }
        if (isDateLessThanToday(fechaFinal.value)) {
            fechaFinal.className = "conError";
        }
        spinner.hidden = true;
    }

})




    btn.addEventListener("click",function(){
        var nombre = $("txtnom");
        var apellido = $("txtapell");
        var telefono = $("txttel");
        var fecha = $("txtfecha");
        
        peticionHttp.onreadystatechange = respuestaPost;
        peticionHttp.open("POST","http://localhost:3000/editar",true);
        peticionHttp.setRequestHeader("content-type","application/json");
        peticionHttp.send(JSON.stringify({'nombre':nombre,'apellido':apellido,'telefono':telefono,'fecha':fecha}));
        function respuestaPost(){
            if(peticionHttp.readyState==4){
                if(peticionHttp.status==200){
                    var tcuerpo = document.getElementById("tCuerpo");
                    tcuerpo.innerHTML = tcuerpo.innerHTML + "<tr><td>"+nombre+"</td>"+"<td>"+apellido+"</td>"+"<td>"+telefono+"</td>"+"<td>"+fecha+"</td>";
                    document.getElementById("div").hidden=true;
                }else{
                    alert("ERROR");
                }
            }
        }
    })
})
/*
Al hacer doble click en una fila de la grilla debe mostrarse, en el centro de la página,
una sección donde debe autocompletarse los datos de la materia. Contendrá un texto
para el nombre, un select para el cuatrimestre (del 1 al 4), un radio para el turno
(Mañana o Noche) y un date para la fecha, un botón para Modificar (verde) y un botón
Eliminar (rojo). (El id no debe mostrase al usuario)
*/
function trerDatos(event) { //muestro el div primero
    document.getElementById("div").className="divisor";
    document.getElementById("div").hidden=false;
    var padre = event.target.parentElement;
    var a1 = padre.firstChild;
    var a2 = a1.nextSibling;
    var a3 = a2.nextSibling;
    var a4 = a3.nextSibling;
    var a5 = padre.lastChild;
    var a1cont = a1.innerHTML;// no muestro el ID de la materia
    var a2cont = a2.innerHTML;
    var a3cont = a3.innerHTML;
    var a4cont = a4.innerHTML;
    var a5cont= a5.innerHTML;
    document.getElementById("txtnom").value = a2cont;
    document.getElementById("txtid").value = a1cont;
    document.getElementById("selectcuatri").value = a3cont;
    fechaarray = a4cont.split("/");
    //document.getElementById("txtfecha").valueAsDate = new Date(fechaarray[2],fechaarray[1],fechaarray[0]);
    //value="2018-07-22";
    document.getElementById("txtfecha").value = fechaarray[2]+"-"+fechaarray[1]+"-"+fechaarray[0];
    if(a5cont=='Mañana'){
        document.getElementById("man").checked = true;
    }else {document.getElementById("noc").checked = true;}
    document.getElementById("selectcuatri").disabled = true;


}



window.addEventListener("load",function(){
    var btn = document.getElementById("btnCerrar");
    btn.addEventListener("click",function(){
        document.getElementById("div").className="divisorCerrar";
        if(document.getElementById("div").style.opacity == 0){
            document.getElementById("div").hidden=true;
        }
        
    })
})

function $(id){
    return document.getElementById(id).value;
    }

function borrar(event){
    
}

