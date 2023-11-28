/**
 * Function to format user error information.
 * @param {Object} user - The user object that the error is associated with.
 * @returns {string} - A formatted string detailing the user error.
 */

export const UserErrorInfo = (user) => {
    return `
    Error con el usuario
    Nombre > ${user.first_name} 
    Apellido > ${user.last_name} 
    Correo electrónico > ${user.email}
    Rol > ${user.rol}
    `;
}


/**
 * Function to format database error information.
 * @param {Object} error 
 * @returns {string}
 */
export const DatabaseErrorInfo = (error) => {
    return `Error con la base de datos: ${error.message}`;
}


/**
 * Function to format route error information.
 * @param {string} route 
 * @returns {string}
 */
export const RouteErrorInfo = (route) => {

    return `Error con la ruta: ${route}`;
}

/**
 * Function to format product error information.
 * @param {Object} product
 * @returns {string} 
 */
export const ProductErrorInfo = (product) => {
    return `
    Error con el producto
    Title > ${product.title}
    Price > ${product.price}
    Description > ${product.description}
    Stock > ${product.stock}
    Category > ${product.category}
    `;
  }
  
/**
 * Function to format ticket error information.
 * @param {Object} ticket
 * @returns {string}
 */
export const TicketErrorInfo = (ticket) => {
    return `Error con el ticket: > ${ticket}`;
}
