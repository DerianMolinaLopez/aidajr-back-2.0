import transport from "../config/nodemailer"

interface IEmailAuth{
     name:string,
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


class EmailAuth{
    static async sendConfirmationEmail(user:IEmailAuth){
        await transport.sendMail({
            from: 'UpTask <derianmolina@gmail.com>',
            to: user.email,
            subject: 'Confirma tu cuenta',
            text: `Confirma tu cuenta`,
            html:`<p>
                      Hola ${user.name} para proceder, debes visitar el siguiente enlace
                  </p>
                 <a href=${process.env.FRONTEND_URL}/auth/confirm-account>Confirmar cuenta</a>
                    <p>Ingresa el codigo:</p><b>${user.token}</b>
                  `
          })
    }

    static async sendPasswordResetToken(user:IEmailAuth){
        await transport.sendMail({
            from: 'UpTask <derianmolina@gmail.com>',
            to: user.email,
            subject: 'Restablece tu contraseña',
            text:      `Restablece tu contraseña`,
            html:`<p>
                      Hola ${user.name} has solicitado reestablecer tu contraseña
                  </p>
                 <a href=${process.env.FRONTEND_URL}/auth/new-password>Establecer contraseña</a>
                    <p>Ingresa el codigo:</p><b>${user.token}</b>
                  `
          })
    }

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
}
export default EmailAuth;