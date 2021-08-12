function errorHandler(error, request, response, next) {
    request.flash(
        'error',
        error.message || 'Oops! Something went badly wrong!');
    return response.status(error.status || 500).redirect(request.user ? '/admin' : '/');
}
module.exports = errorHandler;
