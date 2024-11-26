class ValorationError extends Error {
    //normalmente es un manejo de error cuando no hay un curso
    //existente
     constructor(message:string){
          super(message);
          this.name = "ValorationError";
     }
     
 }