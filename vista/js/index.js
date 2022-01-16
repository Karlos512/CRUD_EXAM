 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
 import { getFirestore, doc,getDocs, collection, addDoc, deleteDoc, updateDoc, getDoc} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyC4tI2-DEiafUi847Ats0dmF4myreuXCnE",
   authDomain: "jobli-dbfirebase.firebaseapp.com",
   projectId: "jobli-dbfirebase",
   storageBucket: "jobli-dbfirebase.appspot.com",
   messagingSenderId: "784694006987",
   appId: "1:784694006987:web:33f07e30af5b4469e8b74e"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);
 
 //
 const formulario = document.querySelector('#formulario');
 const catalogo = document.querySelector('#listado');
 
 let editStatus = false;
 let id = '';
 
 // FUNCIONES        
 const getEvento = (id) => getDoc(doc(db, "eventos", id )); 
 const getEventos = () =>  getDocs(collection(db, "eventos")); 
 const guardarEvento = (DatosEvento) => addDoc(collection(db, "eventos"), DatosEvento); 
 const eliminaEvento = (id) => deleteDoc(doc(db, "eventos", id)); 
 const actualizarEvento = (id,EventoDatosAct) => updateDoc(doc(db, "eventos", id),EventoDatosAct); 

 /////////////////////// LISTAR RESULTADOS ///////////////////////////
 window.addEventListener('DOMContentLoaded', async (e) =>{
 const querySnapshot = await getEventos();
 querySnapshot.forEach((doc) => {
          
 const evento=doc.data();

 function getContrastYIQ(hexcolor){
     hexcolor = hexcolor.replace("#", "");
     var r = parseInt(hexcolor.substr(0,2),16);
     var g = parseInt(hexcolor.substr(2,2),16);
     var b = parseInt(hexcolor.substr(4,2),16);
     var yiq = ((r*299)+(g*587)+(b*114))/1000;
     return (yiq >= 128) ? 'black' : 'white';
 }

     catalogo.innerHTML += `
     <div class="card border-dark mb-3" style="width: 20rem; background-color:${evento.color}; color: ${getContrastYIQ(evento.color)} ;">
         <div class="card-header">
             <h4 class="card-title">${evento.titulo}</h4>
         </div>
         <div class="card-body">  
             <p class="card-text">${evento.descripcion}</p>
             <button type="button" class="btn btn-info btnActualiza" data-id="${doc.id}"><img src="img/actualizar.png" alt="Actualizar"></button>
             <button type="button" class="btn btn-danger btnEliminar" data-id="${doc.id}"><img src="img/eliminar.png" alt="Eliminar"></button>
         </div>
     </div> `;   
 });

 ///////////////////////////////////////////////////////////////////
 const btnsEliminar = document.querySelectorAll('.btnEliminar');
     btnsEliminar.forEach(btnE =>{
         btnE.addEventListener('click', async (e) => {
             var id = e.target.dataset.id;
             console.log(id);
             await eliminaEvento(id);
             alert("Borrado Exitosamente");
             location.reload();
         });
     });
 //////////////////////////////////////////////////////////////////

     const btnsActualiza = document.querySelectorAll(".btnActualiza");
         btnsActualiza.forEach((btnA) => {
         btnA.addEventListener("click", async (e) => {
             console.log(e.target.dataset.id);
             try {
             const docSnap = await getEvento(e.target.dataset.id);
             const evento = docSnap.data();
             formulario['titulo'].value = evento.titulo;
             formulario['descripcion'].value = evento.descripcion;
             formulario['color'].value = evento.color;

             editStatus = true;
             id = docSnap.id;
             document.querySelector("#cabecera").innerHTML = "ACTUALIZAR NOTA '"+evento.titulo+"'"; 
             formulario["btn-guardar"].innerText = "Actualizar";

             } catch (error) {
             console.log(error);
             }
         });
         });
 }); 

 formulario.addEventListener("submit", async (e) => {
 e.preventDefault();

 const titulo = formulario["titulo"];
 const descripcion = formulario["descripcion"];
 const color = formulario["color"];
 

 try {
     if (!editStatus) {
         await guardarEvento({
         titulo: titulo.value,
         descripcion: descripcion.value,
         color: color.value
         });
         location.reload();
     } else {
     await actualizarEvento(id, {
         titulo: titulo.value,
         descripcion: descripcion.value,
         color: color.value
     });

     editStatus = false;
     id = '';
     alert("Se actualizo con exito");
     formulario["btn-guardar"].innerText = "Guardar";
     location.reload();
    }

     formulario.reset();
     titulo.focus();
 } catch (error) {
     console.log(error);
 }
 });
