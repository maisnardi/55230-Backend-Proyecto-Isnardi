//DTO para filtrar informacion de respuesta del endpoint /api/current

export default class CurrentDTO{
    constructor(user){
        this.email=user.email
        this.role=user.role
    }
};