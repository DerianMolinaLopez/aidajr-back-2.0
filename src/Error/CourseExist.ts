class CourseExistError extends Error {
   //normalmente es un manejo de error cuando no hay un curso
   //existente
    constructor(message:string){
         super(message);
         this.name = "CourseExisteErrror";
    }

}
//creamos aqui mismo los posibles errores que pueden haber con
//enumeradores
export enum ErrorCourse{
    COURSE_NOT_FOUND = "El curso no existe"

}
export default CourseExistError;