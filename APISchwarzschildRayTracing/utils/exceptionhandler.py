from rest_framework.views import exception_handler

def custom_exception_handler(exception, context):
    handlers = {
        'SomeError': handle_custom_error,
    }

    response = exception_handler(exception, context)

    exception_class = exception.__class__.__name__

    if exception_class in handlers:
        return handlers[exception_class](exception, context, response)
    return response

def handler_custom_error(exception, context, response):
    response.data = {
        'error': 'Please sort your shit out',

    }

    return response