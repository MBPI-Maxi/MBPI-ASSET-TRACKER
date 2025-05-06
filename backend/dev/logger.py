import logging

def log_message(msg, option=None):
    """
    Log message using python logging
    
    Args:
        msg = string message
        option = Either [debug, info, warning, error, critical]
    
    Returns:
        None
    """
    message_structure = f"\n***\n{msg}\n***\n"
    
    if option == "debug":
        logging.basicConfig(level=logging.DEBUG)
        logging.debug(message_structure)
    elif option == "info":
        logging.basicConfig(level=logging.INFO)
        logging.info(message_structure)
    elif option == "warning":
        logging.warning(message_structure)
    elif option == "error":
        logging.error(message_structure)
    elif option == "critical":
        logging.error(message_structure)
    else:
        logging.basicConfig(level=logging.INFO)
        logging.info(message_structure)