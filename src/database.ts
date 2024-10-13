import moongose, { connect } from 'mongoose';


export const conectDB = async()=>{
    try{
        //en esta forma a coparacion del curso anterior, requeria mucho mas 
        //codigo para conectarse a la base de datos
    
        const connection = await moongose.connect(process.env.DATABASE_URl!)
         console.log('la base de datos esta corriendo en:')
         console.log(connection.connection.host)
    }catch(e){
        console.log(e)
        process.exit(1)//quiere decir que el programa fallo y se  detiene
    }
}