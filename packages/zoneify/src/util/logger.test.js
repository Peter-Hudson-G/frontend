/* eslint-disable no-console */
const {
  formatter, log, levels, spinner,
} = require('./logger')

global.console = {
  log: jest.fn(),
}

describe('logger', () => {
  const message = 'test'
  const debugOutput = formatter({ level: 'debug', message })
  const errorOutput = formatter({ level: 'error', message })
  const infoOutput = formatter({ level: 'info', message })

  it('should have log levels', () => {
    expect(levels).toMatchSnapshot()
  })

  it('should a default log level of info', () => {
    expect(log.level).toBe('info')
  })

  Object.keys(levels).forEach((level) => {
    it(`should have a method for ${level}`, () => {
      expect(typeof log[level]).toBe('function')
    })

    it(`should set the log level to ${level}`, () => {
      log.level = level
      expect(log.level).toBe(level)
    })
  })

  it('should set not change the log level', () => {
    const originalLevel = log.level

    log.level = 'hello world'
    expect(log.level).toBe(originalLevel)
  })

  it('should format debug logs', () => {
    expect(debugOutput).toMatchSnapshot()
  })

  it('should format info logs', () => {
    expect(infoOutput).toMatchSnapshot()
  })

  it('should format error logs', () => {
    expect(errorOutput).toMatchSnapshot()
  })

  it('should format error/info/debug logs differently', () => {
    expect(debugOutput).not.toEqual(infoOutput)
    expect(debugOutput).not.toEqual(errorOutput)
    expect(errorOutput).not.toEqual(infoOutput)
  })

  it('should start/stop the spinner', () => {
    const spinnerMessage = 'Test'

    spinner.start(spinnerMessage)
    expect(spinner.isSpinning).toBeTruthy()
    log.info('Test')
    expect(spinner.isSpinning).toBeTruthy()
    spinner.stop()
  })

  it('should not start/stop the spinner', () => {
    expect(spinner.isSpinning).toBeFalsy()
    log.info('Test')
    expect(spinner.isSpinning).toBeFalsy()
  })

  it('should not log debug messages when info', () => {
    log.level = 'info'
    expect(log.level).toBe('info')
    log.debug('Test debug')
    expect(console.log).not.toBeCalled()
  })

  afterEach(() => {
    console.log.mockReset()
  })
})
