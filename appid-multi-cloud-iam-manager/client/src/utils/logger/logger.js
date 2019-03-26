import Logger from 'js-logger';
Logger.useDefaults();
Logger.setLevel(Logger.WARN);

Logger.getLoggerWithLevel = (name, level) => {
    const logger = Logger.get(name);
    logger.setLevel(level || Logger.WARN);
    return logger;
};

export default Logger;