import transport from "../config/nodemailer"

export interface IEmailAuth{
     token:string,
     email:string
}
//{password: '1111', securityNumbers: '1111', costo: 0, id_course: '66f079cc58bf3753e9b84128'}
interface ConfirmarCompra{
    costo:number,
    courseName:string,
    instructorName:string
    email:string
}
export type formInputConfirmPayment = {
    password:string,
    securityNumbers:string,
    //!como es simulacion nomas, ignoraremos lo de security numbers  
}
export type EnvioConfirmarCurso ={
    email:string
    curso:string,
    costo:string,
    intructor:string,
    user:string
}
export type compraPeriodos = formInputConfirmPayment &{
    tittle:string
    price:string
    numberCard:string
} & Pick<ConfirmarCompra,'email'>



class EmailAuth{
    static async facturaCompra(compra:EnvioConfirmarCurso){
        await transport.sendMail({
            from: 'AIDAjr <AIDAjr@gmail.com>',
            to: compra.email,
            subject: 'Ticket de compra',
            text:      `Ticket de compra del curso ${compra.curso}`,
            html:`
            <main style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #333;">Hola ${compra.user},</h2>
                <p style="color: #555; line-height: 1.5;">
                    ¡Gracias por su compra! Apreciamos su confianza al adquirir nuestro curso y <br />
                    estamos emocionados de ser parte de su crecimiento. Si tiene alguna pregunta o <br />
                    necesita asistencia, no dude en contactarnos. ¡Le deseamos mucho éxito en su aprendizaje!
                </p>
                <p style="color: #333; font-weight: bold;">Has comprado el curso <span style="color: #007bff;">${compra.curso}</span>.</p>
                <p style="color: #333;">Con un costo de <strong style="color: #e74c3c;">$${compra.costo} MXN</strong>.</p>
          </main>

            `
          })
    }
    static async facturaCompraPeriodos(compra:compraPeriodos){
        await transport.sendMail({
            from: 'AIDAjr <AIDAjr@gmail.com>',
            to: compra.email,
            subject: 'Ticket de compra',
            text:      `Ticket de compra de instructor para periodos ${compra.tittle}`,
            html:`
            <main style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #333;">Gracias por la confianza</h2>
                <p style="color: #555; line-height: 1.5;">
                    ¡Gracias por su compra! apreciamos que haya considerado unirse a nuestro equipo de trabajo <br />
                    ahora tiene acceso a los beneficios de su paquete comprado <br />
                    si tiene dudas sobre nuestras politicas de cancelacion  de devolucion, le recomendamos leer los terminos y condiciones
                </p>
                <p style="color: #333; font-weight: bold;">Has comprado el periodo <span style="color: #007bff;">${compra.tittle}</span>.</p>
                <p style="color: #333;">Con un costo de <strong style="color: #e74c3c;">$${compra.price} MXN</strong>.</p>

                <p>Para proteger la integridad de nuestros clientes, su numero de seguridad como su numerode cuenta
                    no se guardaran en nuestro sistema, por lo que le recomendamos guardar esta informacion en un lugar seguro
                    y guardar el recibo de compra, de lo contrario no seria posible una devolucion o reclamacion en un futuro pronto.
                </p>
          </main>`

          })
    }
    static async sendCodeForgotPassword(data:IEmailAuth){
        await transport.sendMail({
            from: 'AIDAjr <AIDAjr@gmail.com>',
            to: data.email,
            subject: 'Ticket de compra',
            text:      `Token de recuperacion de cuenta`,
            html:`
               <main>
                Para recuperar tu cuenta, ingresa el siguiente codigo ${data.token}.
                Ingresa al siguiente link para recuperar tu cuenta <a href=${process.env.FRONTEND_URL}/auth/forgot/token>Recuperar cuenta</a>
               </main>
              `
    })
}
}


export default EmailAuth;